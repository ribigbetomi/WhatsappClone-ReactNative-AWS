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
dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [imageSources, setImageSources] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  // console.log(imageSources, "sourcess");
  // const isMyMessage = () => {
  //   return message.userID === authUser.attributes.sub;
  // };

  //   const [downloadAttachments, setDownloadedAttachments] = useState([]);

  //   const { width } = useWindowDimensions();

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      setIsMe(message.userID === authUser.attributes.sub);
    };

    isMyMessage();
  }, []);

  useEffect(() => {
    const downloadedImages = async () => {
      if (message.images?.length > 0) {
        const uri = await Storage.get(message.images[0], { level: "public" });
        // console.log(uri, "uri");
        setImageSources([{ uri }]);
      }
    };
    downloadedImages();
    // const downloadAttachments = async () => {
    //   if (message.Attachments.items) {
    //     const downloadedAttachments = await Promise.all(
    //       message.Attachments.items.map((attachment) =>
    //         Storage.get(attachment.storageKey).then((uri) => ({
    //           ...attachment,
    //           uri,
    //         }))
    //       )
    //     );

    //     setDownloadedAttachments(downloadedAttachments);
    //   }
    // };
    // downloadAttachments();
  }, [message]);
  // console.log(imageSources, "sourcess");
  // }, [JSON.stringify(message.Attachments.items)]);

  //   const imageContainerWidth = width * 0.8 - 30;

  //   const imageAttachments = downloadAttachments.filter(
  //     (at) => at.type === "IMAGE"
  //   );
  //   const videoAttachments = downloadAttachments.filter(
  //     (at) => at.type === "VIDEO"
  //   );

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
      {message.images?.length > 0 && (
        <>
          {/* <Text>test</Text> */}
          <Pressable onPress={() => setImageViewerVisible(true)}>
            <Image source={imageSources[0]} style={styles.image} />
            {/* to display image using url */}
          </Pressable>
          <ImageView
            images={imageSources}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
          />
        </>
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
    width: 200,
    height: 100,
    // flex: 1,
    borderColor: "white",
    resizeMode: "contain",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default Message;
