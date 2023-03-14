import { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Text,
  // SafeAreaView,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import {
  createMessage,
  updateChatRoom,
  createAttachment,
} from "../graphql/mutations";
import * as ImagePicker from "expo-image-picker";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const InputBox = ({ chatRoom }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  // console.log(text, "text");
  // console.log(image, "img");
  const [files, setFiles] = useState([]);
  //   const [progresses, setProgresses] = useState({});

  // const addAttachment = async (file, messageID) => {
  //   const types = {
  //     image: "IMAGE",
  //     video: "VIDEO",
  //   };

  //   const newAttachment = {
  //     storageKey: await uploadFile(file.uri),
  //     type: types[file.type],
  //     width: file.width,
  //     height: file.height,
  //     duration: file.duration,
  //     messageID,
  //     chatroomID: chatroom.id,
  //   };
  //   return API.graphql(
  //     graphqlOperation(createAttachment, { input: newAttachment })
  //   );
  // };
  const onSend = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    const newMessage = {
      chatroomID: chatRoom.id,
      text,
      userID: authUser.attributes.sub,
    };
    if (image) {
      console.log(image, "image");
      // let img = await uploadFile(image);
      // newMessage.images = [].push(img);
      newMessage.images = [await uploadFile(image)];
      setImage(null);
    }
    console.log(newMessage.images, "newimg");

    const newMessageData = await API.graphql(
      graphqlOperation(createMessage, { input: newMessage })
    );
    console.log(newMessageData);
    // console.warn("Sending new message: ", newMessage);

    setText("");

    //   // create attachments
    //   await Promise.all(
    //     files.map((file) =>
    //       addAttachment(file, newMessageData.data.createMessage.id)
    //     )
    //   );
    //   setFiles([]);

    //   // set the new message as LastMessage of the ChatRoom
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatRoom._version,
          chatRoomLastMessageId: newMessageData.data.createMessage.id,
          id: chatRoom.id,
        },
      })
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      // allowsMultipleSelection: true,
    });
    // console.log(result, "result");

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      // console.log(JSON.stringify(result.assets[0].uri), "stringimageUri");
      // if (result.selected) {
      //   setFiles(result.selected);
      // } else {
      //   setFiles([result]);
      // }
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      console.log(response, "response");
      const blob = await response.blob();
      console.log(blob, "blob");
      const key = `${uuidv4()}.png`;
      console.log(key, "key");

      console.log(blob.data.type, "blobtype");
      await Storage.put(key, blob, {
        contentType: blob.data.type,
        // contentType: "image/jpeg",
        // contentType is optional
        // progressCallback: (progress) => {
        //   console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        //   setProgresses((p) => ({
        //     ...p,
        //     [fileUri]: progress.loaded / progress.total,
        //   }));
        // },
      });
      // console.log(key, "key");
      // console.log(JSON.stringify(key), "stringifyKey");
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  return (
    //   {/* {files.length > 0 && (
    //   <View style={styles.attachmentsContainer}>
    //     <FlatList
    //       data={files}
    //       horizontal
    //       renderItem={({ item }) => (
    //         <>
    //           <Image
    //             source={{ uri: item.uri }}
    //             style={styles.selectedImage}
    //             resizeMode="contain"
    //           />

    //           {progresses[item.uri] && (
    //             <View
    //               style={{
    //                 position: "absolute",
    //                 top: "50%",
    //                 left: "50%",
    //                 backgroundColor: "#8c8c8cAA",
    //                 padding: 5,
    //                 borderRadius: 50,
    //               }}
    //             >
    //               <Text style={{ color: "white", fontWeight: "bold" }}>
    //                 {(progresses[item.uri] * 100).toFixed(0)} %
    //               </Text>
    //             </View>
    //           )}

    //           <MaterialIcons
    //             name="highlight-remove"
    //             onPress={() =>
    //               setFiles((existingFiles) =>
    //                 existingFiles.filter((file) => file !== item)
    //               )
    //             }
    //             size={20}
    //             color="gray"
    //             style={styles.removeSelectedImage}
    //           />
    //         </>
    //       )}
    //     />
    //   </View>
    // )} */}

    <>
      {image && (
        <View style={styles.attachmentsContainer}>
          <Image
            source={{ uri: image }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
          <MaterialIcons
            name="highlight-remove"
            onPress={() => setImage("")}
            // onPress={() =>
            //   setFiles((existingFiles) =>
            //     existingFiles.filter((file) => file !== item)
            //   )
            // }
            size={20}
            color="gray"
            style={styles.removeSelectedImage}
          />
        </View>
      )}

      <SafeAreaView edges={["bottom"]} style={styles.container}>
        {/* Icon */}
        <AntDesign
          onPress={pickImage}
          name="plus"
          size={20}
          color="royalblue"
        />

        {/* Text Input */}
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Type your message..."
        />

        {/* Icon */}
        <MaterialIcons
          onPress={onSend}
          style={styles.send}
          name="send"
          size={16}
          color="white"
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },

  attachmentsContainer: {
    alignItems: "flex-end",
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  removeSelectedImage: {
    position: "absolute",
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default InputBox;
