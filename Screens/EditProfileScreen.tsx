import { View, Text, SafeAreaView, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";

const defaultProfile = "https://creativeloafing.com/dl39257?display&x=1040&y=780";
const yeezyZebra =
  "https://1.kixify.com/sites/default/files/imagecache/product_full/product/2020/04/27/p_30009391_171134591_240382.jpg";
const userImages = [yeezyZebra, yeezyZebra, yeezyZebra];

export default function EditProfileScreen({ navigation }: any) {
  const { data: userData, isLoading } = useQuery("user", () => fetchUser(1));
	console.log(userData);

  return (
    <>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <SafeAreaView style={styles.profileScreenContainer}>
          <Button title="Edit"></Button>
          <View style={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
            <Image source={{ uri: userData.userImage }} style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 1 }} />
            <Text style={styles.title}>{userData.sellerName}</Text>
          </View>
          <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Text style={styles.header}>Description</Text>
              <Button title="Edit"></Button>
            </View>
            <Text style={styles.bio}>
              {userData.description}
            </Text>
          </View>
          <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Text style={styles.header}>Listings</Text>
            </View>
            <View style={styles.userImagesContainer}>
              {userData.listings.map((image: string, index: number) => (
                <TouchableOpacity onPress={() => navigation.navigate("CreateStack", { screen: "Listing" })} key={index}>
                  <Image source={{ uri: image.images[0] }} style={styles.userImages} />
                  {/* <Button onPress={() => navigation.navigate("CreateStack", { screen: "Listing" })} title="Edit"></Button> */}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  profileScreenContainer: {
    margin: 20,
  },
  userImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  userImages: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    margin: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  body: {
    fontSize: 22,
  },
  bio: {
    fontSize: 17,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 30,
    padding: 4,
    paddingTop: 1,
    paddingBottom: 1,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    marginRight: 15,
  },
});
