import { Video } from "expo-av";
import { StyleSheet, View } from "react-native";

const VideoAttachments = ({ width, attachments }) => {
  return (
    <>
      {attachments.map((attachment) => (
        <View
          style={[
            styles.videoContainer,
            attachments.length === 1 && { flex: 1 },
          ]}
        >
          <Video
            key={attachment.id}
            useNativeControls
            source={{
              uri: attachment.uri,
            }}
            shouldPlay={false}
            style={styles.video}
            resizeMode="contain"
          />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: "50%",
    aspectRatio: 1,
    padding: 3,
  },
  video: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
});
export default VideoAttachments;
