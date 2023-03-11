import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import { useEffect, useState } from "react";
// import { Auth, API, graphqlOperation } from "aws-amplify";
// import { createChatRoom, createUserChatRoom } from "../graphql/mutations";
// import { getCommonChatRoomWithUser } from "../services/chatRoomService";
// import { onUpdateChatRoom } from "../../graphql/subscriptions";

dayjs.extend(relativeTime);

const ContactsListItem = ({
  user,
  onPress = () => {},
  selectable = false,
  isSelected = false,
}) => {
  // console.log(user, "user");
  const navigation = useNavigation();

  // const onPress = async () => {
  //   const authUser = await Auth.currentAuthenticatedUser();
  //   // console.log(authUser, "authuser");
  //   // console.warn("Pressed");

  //   const existingChatRoom = await getCommonChatRoomWithUser(user.id);
  //   // console.log(existingChatRoom, "exist");

  //   if (existingChatRoom) {
  //     // let user = existingChatRoom.chatRoom.users.items.find(
  //     //   (user) =>  user.user.id !== authUser.attributes.sub
  //     // );
  //     navigation.navigate("Chat", {
  //       id: existingChatRoom.chatRoom.id,
  //       name: user.name,
  //     });
  //     return;
  //   } else {
  //     //Check if we already have a chatroom with user

  //     // Create a new chatroom
  //     const newChatRoomData = await API.graphql(
  //       graphqlOperation(createChatRoom, { input: {} })
  //     );
  //     // console.log(newChatRoomData, "new");

  //     if (!newChatRoomData.data?.createChatRoom) {
  //       console.log("Error creating the chat room");
  //     }
  //     const newChatRoom = newChatRoomData.data?.createChatRoom;
  //     // console.log(newChatRoom, "neww");

  //     //Add clicked user to chatroom
  //     await API.graphql(
  //       graphqlOperation(createUserChatRoom, {
  //         input: { chatRoomId: newChatRoom.id, userId: user.id },
  //       })
  //     );

  //     //Add authenticated user to the chatroom
  //     await API.graphql(
  //       graphqlOperation(createUserChatRoom, {
  //         input: {
  //           chatRoomId: newChatRoom.id,
  //           userId: authUser.attributes.sub,
  //         },
  //       })
  //     );

  //     //Navigate to the newly created chatroom
  //     navigation.navigate("Chat", { id: newChatRoom.id, name: user.name });
  //   }
  // };
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{
          uri: user.image,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {user.name}
        </Text>
        <Text numberOfLines={2} style={styles.subTitle}>
          {user.status}
        </Text>
      </View>
      {selectable &&
        (isSelected ? (
          <AntDesign name="checkcircle" size={24} color="royalblue" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="lightgray" />
        ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    // flex: 1,
    fontWeight: "bold",
  },
  content: {
    // backgroundColor: "red",
    marginRight: 10,
    flex: 1,
    // maxWidth: "80%",
    // overflow: "hidden",
  },
  subTitle: {
    color: "gray",
  },
});

export default ContactsListItem;
