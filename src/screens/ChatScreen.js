import { useEffect, useLayoutEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";

// import Message from "../../components/Message";
// import InputBox from "../../components/InputBox";

// import bg from "../../../assets/images/BG.png";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";
import {
  onCreateAttachment,
  onCreateMessage,
  onUpdateChatRoom,
} from "../graphql/subscriptions";
// import { Feather } from "@expo/vector-icons";

import Message from "../components/ChatListItem/Message";
import InputBox from "../components/InputBox";
import { Feather } from "@expo/vector-icons";

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  // console.log(chatRoom, "chatRoomm");
  const [messages, setMessages] = useState([]);
  // console.log(messages, "messages");

  const route = useRoute();
  const chatRoomID = route.params.id;
  const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.setOptions({ title: route.params.name });
  // }, [route.params.name]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerRight: () => (
        <Feather
          onPress={() => navigation.navigate("Group Info", { id: chatRoomID })}
          name="more-vertical"
          size={24}
          color="black"
        />
      ),
    });
  }, [route.params.name, chatRoomID]);

  // fetch Chat Room
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomID })).then(
      (result) => setChatRoom(result.data?.getChatRoom)
      // setMessages(result.data?.getChatRoom?.Messages?.items);
    );

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomID } } })
    ).subscribe({
      next: ({ value }) => {
        // console.log(value, "updatedd");
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (err) => console.warn(err),
    });
    return () => subscription.unsubscribe();
  }, [chatRoomID]);

  //     const subscription = API.graphql(
  //       graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatroomID } } })
  //     ).subscribe({
  //       next: ({ value }) => {
  //         setChatRoom((cr) => ({
  //           ...(cr || {}),
  //           ...value.data.onUpdateChatRoom,
  //         }));
  //       },
  //       error: (err) => console.warn(err),
  //     });

  //     return () => subscription.unsubscribe();
  //   }, [chatroomID]);

  // // fetch Messages
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID: chatRoomID,
        sortDirection: "DESC",
      })
    ).then((result) => {
      setMessages(result.data?.listMessagesByChatRoom?.items);
    });

    //     // Subscribe to new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatRoomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        // console.log(value, "New Message");
        setMessages((m) => [value.data.onCreateMessage, ...m]);
      },
      error: (err) => console.warn(err),
    });

    //     // Subscribe to new attachments
    //     const subscriptionAttachments = API.graphql(
    //       graphqlOperation(onCreateAttachment, {
    //         filter: { chatroomID: { eq: chatroomID } },
    //       })
    //     ).subscribe({
    //       next: ({ value }) => {
    //         const newAttachment = value.data.onCreateAttachment;
    //         setMessages((existingMessages) => {
    //           const messageToUpdate = existingMessages.find(
    //             (em) => em.id === newAttachment.messageID
    //           );
    //           if (!messageToUpdate) {
    //             return existingMessages;
    //           }
    //           if (!messageToUpdate?.Attachments?.items) {
    //             messageToUpdate.Attachments.items = [];
    //           }
    //           messageToUpdate.Attachments.items.push(newAttachment);

    //           return existingMessages.map((m) =>
    //             m.id === messageToUpdate.id ? messageToUpdate : m
    //           );
    //         });
    //       },
    //       error: (err) => console.warn(err),
    //     });

    return () => {
      subscription.unsubscribe();
      // subscriptionAttachments.unsubscribe();
    };
  }, [chatRoomID]);

  //   useEffect(() => {
  //     navigation.setOptions({
  //       title: route.params.name,
  //       headerRight: () => (
  //         <Feather
  //           onPress={() => navigation.navigate("Group Info", { id: chatroomID })}
  //           name="more-vertical"
  //           size={24}
  //           color="gray"
  //         />
  //       ),
  //     });

  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  // console.log(JSON.stringify(chatRoom));

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
    //   style={styles.bg}
    // >
    //   <ImageBackground source={bg} style={styles.bg}>
    //     <FlatList
    //       data={messages}
    //       renderItem={({ item }) => <Message message={item} />}
    //       style={styles.list}
    //       inverted
    //     />
    //     {/* <InputBox chatroom={chatRoom} /> */}
    //   </ImageBackground>
    // </KeyboardAvoidingView>
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === "iOS" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "iOS" ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          // data={chatRoom.Messages.items}
          renderItem={({ item }) => <Message message={item} />}
          keyExtractor={(item) => item.id}
          style={styles.list}
          inverted
        />
        <InputBox chatRoom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
