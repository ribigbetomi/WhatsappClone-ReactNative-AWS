import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Image,
} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Auth, JS } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { S3Image } from "aws-amplify-react-native";
// import ImageAttachments from "./ImageAttachments";
// import VideoAttachments from "./VideoAttachments";
import ImageView from "react-native-image-viewing";
import { Video } from "expo-av";
import ImageAttachments from "./ImageAttachments";
import VideoAttachments from "./VideoAttachments";

dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [imageSources, setImageSources] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const { width } = useWindowDimensions();
  const [downloadedAttachments, setDownloadedAttachments] = useState([]);

  // console.log(imageSources, "sourcess");
  // const isMyMessage = () => {
  //   return message.userID === authUser.attributes.sub;
  // };

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      setIsMe(message.userID === authUser.attributes.sub);
    };

    isMyMessage();
  }, []);

  useEffect(() => {
    // const downloadedAttachments = async () => {
    //   if (message.Attachments?.items?.length > 0) {
    //     // const uri = await Storage.get(message.images[0], { level: "public" });
    //     // console.log(uri, "uri");
    //     const uris = await Promise.all(message.Attachments.items.map(Storage.get));
    //     // since the parameter of the arrow function is the same with the parameter of the function we're calling, we can also do images.map(uploadFile)
    //     setImageSources(uris.map((uri) => ({ uri })));
    //     // setImageSources([{ uris }]);
    //   }
    // };
    // downloadedAttachments();

    const downloadAttachments = async () => {
      if (message.Attachments.items) {
        const downloadedAttachments = await Promise.all(
          message.Attachments.items.map((attachment) =>
            Storage.get(attachment.storageKey).then((uri) => ({
              ...attachment,
              uri,
            }))
          )
        );

        setDownloadedAttachments(downloadedAttachments);
      }
    };
    downloadAttachments();
  }, [JSON.stringify(message.Attachments.items)]);
  // console.log(imageSources, "sourcess");
  // }, [JSON.stringify(message.Attachments.items)]);

  const imageContainerWidth = width * 0.8 - 30;

  const imageAttachments = downloadedAttachments.filter(
    (at) => at.type === "IMAGE"
  );
  const videoAttachments = downloadedAttachments.filter(
    (at) => at.type === "VIDEO"
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#DCF8C5" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      {downloadedAttachments.length > 0 && (
        <View style={[{ width: imageContainerWidth }, styles.images]}>
          <ImageAttachments attachments={imageAttachments} />
          <VideoAttachments
            attachments={videoAttachments}
            width={imageContainerWidth}
          />
          {/* {downloadedAttachments.map((attachment, index) =>
            attachment.type === "IMAGE" ? (
              <Pressable
                style={
                  downloadedAttachments.length === 1
                    ? { width: "100%", aspectRatio: 2, padding: 3 }
                    : styles.imageContainer
                }
                key={index}
                onPress={() => setImageViewerVisible(true)}
              >
                <Image source={{ uri: attachment.uri }} style={styles.image} />
              </Pressable>
            ) : (
              <Video
                key={attachment.id}
                useNativeControls
                source={{
                  uri: attachment.uri,
                }}
                shouldPlay={false}
                style={{
                  width: imageContainerWidth,
                  height:
                    (attachment.height * imageContainerWidth) /
                    attachment.width,
                }}
                resizeMode="contain"
              />
            )
          )}
          <ImageView
            images={downloadedAttachments.map(({ uri }) => ({ uri }))}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
          /> */}
        </View>
      )}
      {/* <S3Image imgKey={message.images[0]} style={styles.image} /> */}
      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
      {/* {downloadAttachments.length > 0 && (
        <View style={[{ width: imageContainerWidth }, styles.images]}>
          <ImageAttachments attachments={imageAttachments} />

          <VideoAttachments
            attachments={videoAttachments}
            width={imageContainerWidth}
          />
        </View>
      )} */}
      {/* <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",

    // Shadows
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "50%",
    aspectRatio: 1,
    padding: 3,
  },
  image: {
    // width: 200,
    // height: 100,
    flex: 1,
    borderColor: "white",
    resizeMode: "contain",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default Message;
