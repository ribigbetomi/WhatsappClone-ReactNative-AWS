import { FlatList, Text, View } from "react-native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import chats from "../../../assets/data/chats.json";
import ChatListItem from "../../components/ChatListItem";
import { listChatRooms } from "./queries";
import { onUpdateChatRoom } from "../../graphql/subscriptions";

const ChatsScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(chatRooms, "croom");

  const fetchChatRooms = async () => {
    setLoading(true);
    const authUser = await Auth.currentAuthenticatedUser();

    const response = await API.graphql(
      graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    );
    // console.log(response, "res");

    const rooms = response?.data?.getUser?.ChatRooms?.items?.filter(
      (item) => !item._deleted
    );
    const sortedRooms = rooms.sort(
      (r1, r2) =>
        new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt)
    );

    setChatRooms(sortedRooms);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, [listChatRooms]);

  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onUpdateChatRoom)
  //   ).subscribe({
  //     next: ({ value }) => {
  //       console.log(value.data, "value");
  //       // setChatRooms((cr) => ({
  //       //   ...(cr || {}),
  //       //   ...value.data.onUpdateChatRoom,
  //       // }));
  //       fetchChatRooms();
  //     },
  //     error: (err) => console.warn(err),
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <FlatList
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      style={{ backgroundColor: "white" }}
      refreshing={loading}
      onRefresh={fetchChatRooms}
    />

    // <FlatList
    //   data={chats}
    //   renderItem={({ item }) => <ChatListItem chat={item} />}
    //   style={{ backgroundColor: "white" }}
    //   //   style={{ backgroundColor: "white" }}
    //   //   refreshing={loading}
    //   //   onRefresh={fetchChatRooms}
    // />
    // <View>
    //   <Text>ChatsScreen</Text>
    // </View>
  );
};

export default ChatsScreen;
