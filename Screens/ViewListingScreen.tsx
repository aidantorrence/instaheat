import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import Swiper from "react-native-swiper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteListing, fetchUser, postFlagContent } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";

const defaultProfile = "https://yt3.ggpht.com/-2lcjvQfkrNY/AAAAAAAAAAI/AAAAAAAAAAA/ouxs6ZByypg/s900-c-k-no/photo.jpg";

export default function ViewListingScreen({ navigation, route }: any) {
  const { id, ownerId } = route.params;
  const { data, isLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  const user = useStore((state) => state.user);
  const isUserListing = user?.uid === ownerId;
  const queryClient = useQueryClient();
  const mutation: any = useMutation(() => deleteListing({ id }), {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("listings");
    },
  });

  const handleProfilePress = (uid: any) => {
    navigation.navigate("ViewProfile", {
      ownerId: uid,
    });
  };

  const handleSubmitFlaggedContent = (details: string | undefined, reason: string) => {
    postFlagContent({ reason: `${reason}: ${details}`, listingId: id, uid: user?.uid });
    Alert.alert("This listing has been flagged for review");
    navigation.navigate("HomeTabs");
  };

  const handleFlagContentConfirm = (reason: string) => {
    Alert.prompt("Please provide details", "", [
      {
        text: "OK",
        onPress: (details) => handleSubmitFlaggedContent(details, reason),
      },
    ]);
    //
  };

  const handleFlagContent = () => {
    Alert.alert("Reasons for flagging content", "Please let us know why you think this content violates Instaheat policies", [
      {
        text: "Sexual Content",
        onPress: () => handleFlagContentConfirm("Sexual Content"),
      },
      {
        text: "Violence",
        onPress: () => handleFlagContentConfirm("Violence"),
      },
      {
        text: "Hate Speech",
        onPress: () => handleFlagContentConfirm("Hate Speech"),
      },
      {
        text: "Spam",
        onPress: () => handleFlagContentConfirm("Spam"),
      },
      {
        text: "Other",
        onPress: () => handleFlagContentConfirm("Other"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handleActions = () => {
    Alert.alert("Actions", "What would you like to do?", [
      {
        text: "Flag",
        onPress: handleFlagContent,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handlePress = (val: string) => {
    if (val === "Edit") {
      navigation.navigate("EditListing", {
        id,
      });
    } else {
      Alert.alert("Are you sure you want to delete this listing?", "", [
        {
          text: "Cancel",
        },
        { text: "OK", onPress: () => handleDelete() },
      ]);
    }
  };

  const handleDelete = () => {
    mutation.mutate();
    navigation.goBack();
  };

  const handleAlert = () => {
    Alert.alert("Select action", "", [
      {
        text: "Edit Listing",
        onPress: () => handlePress("Edit"),
      },
      {
        text: "Delete Listing",
        onPress: () => handlePress("Delete"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handleMakeOffer = () => {
    if (!user) {
      navigation.navigate("SignUp");
      return;
    }
    navigation.navigate("PaymentStack", {
      screen: "Offer",
      params: {
        screen: "Offer",
        id,
        ownerId,
      },
    });
  };
  const handleBuy = () => {
    if (!user) {
      navigation.navigate("SignUp");
      return;
    }
    navigation.navigate("PaymentStack", {
      screen: "Payment",
      params: {
        screen: "Payment",
        id,
        ownerId,
      },
    });
  };
  const handleTrade = () => {
    if (!user) {
      navigation.navigate("SignUp");
      return;
    }
    navigation.navigate("TradeStack", {
      screen: "ItemsWanted",
      params: {
        screen: "ItemsWanted",
        id,
        ownerId,
      },
    });
  };

  const listing = data?.listings?.find((listing: any) => listing.id === id);
  console.log(listing?.listingDefects);

  function Item({ item }: any) {
    return (
      <Swiper style={{ height: 300 }}>
        {item.images.map((image: any, index: any) => {
          return <Image key={index} source={{ uri: image }} style={styles.image} />;
        })}
      </Swiper>
    );
  }

  return (
    !isLoading && (
      <>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.item}>
              <TouchableOpacity onPress={() => handleProfilePress(ownerId)} style={styles.userContainer}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: data.userImage || defaultProfile }} style={styles.userImage} />
                  <Text style={styles.sellerName}>{data.sellerName}</Text>
                </View>
                {isUserListing ? (
                  <TouchableOpacity style={{ padding: 10 }} onPress={handleAlert}>
                    <Image style={{ width: 20, height: 20 }} source={require("../assets/Settings.png")} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={{ padding: 10 }} onPress={handleActions}>
                    <Image style={{ width: 20, height: 20 }} source={require("../assets/Ellipsis_Logo.png")} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <Item item={listing} />
              <View style={styles.detailsContainer}>
                <View style={styles.nameConditionSizeContainer}>
                  <Text style={styles.name}>{listing.name}</Text>
                  <Text style={styles.description}>
                    Condition: {listing.condition} Size {listing.size}
                  </Text>
                  <Text style={styles.description}>Size: {listing.size}</Text>
                  <Text style={styles.description}>No box</Text>
                  {listing.condition !== "Brand New" && <>
                    <Text style={styles.description}>Defects:</Text>
                    {listing?.listingDefects.map((defect: any, index: number) => {
                      return <Text style={styles.description} key={index}>{defect}</Text>
                    })}
                  </>}
                </View>
                <View style={styles.priceCanTradeContainer}>
                  <Text style={styles.price}>${listing.price}</Text>
                  {listing.canTrade ? <Image style={styles.canTrade} source={require("../Trade.png")} /> : null}
                </View>
              </View>
            </View>
            <Text style={styles.header}>Other Listings</Text>
            <View style={styles.userImagesContainer}>
              {data.listings
                .filter((listing: any) => listing.id !== id)
                .map((listing: any) => (
                  <Image key={listing.id} source={{ uri: listing.images[0] }} style={styles.userImages} />
                ))}
            </View>
          </ScrollView>
          {!isUserListing ? (
            <View style={styles.footerButtons}>
              {listing.canTrade ? (
                <TouchableOpacity onPress={handleTrade} style={[styles.button, { backgroundColor: "white" }]}>
                  <Text style={styles.buttonText}>Trade</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={handleMakeOffer} style={[styles.button, { backgroundColor: "gray" }]}>
                <Text style={styles.buttonText}>Make Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBuy} style={[styles.button, { backgroundColor: "red" }]}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
      </>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  subHeader: {
    flexDirection: "row",
  },
  subHeaderText: {
    marginRight: 20,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  buttonText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "red",
    borderWidth: 0.5,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  userImagesContainer: {
    flexDirection: "row",
  },
  userImages: {
    width: 80,
    height: 80,
    margin: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  // description: {
  //   fontWeight: "bold",
  //   fontSize: 20,
  // },
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
  image: {
    width: "100%",
    height: 300,
  },
  userImage: {
    borderRadius: 50,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  sellerName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  canTrade: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  detailsContainer: {
    flexDirection: "row",
    padding: 10,
  },
  description: {
    fontSize: 20,
    color: "gray",
    paddingBottom: 7,
  },
  nameConditionSizeContainer: {
    width: "75%",
  },
  priceCanTradeContainer: {
    width: "25%",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    alignItems: "center",
    // paddingBottom: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
});
