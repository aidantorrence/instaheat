import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useQuery } from "react-query";
import { fetchListings } from "../data/api";
import { useStore } from "../utils/firebase/useAuthentication";
import { QueryCache } from "react-query";
const queryCache = new QueryCache({});
const defaultProfile = "https://yt3.ggpht.com/-2lcjvQfkrNY/AAAAAAAAAAI/AAAAAAAAAAA/ouxs6ZByypg/s900-c-k-no/photo.jpg";
import Swiper from "react-native-swiper";
import { SearchBar } from "@rneui/themed";
import { useState } from "react";
import FastImage from "react-native-fast-image";
import { FlashList } from "@shopify/flash-list";

export default function HomeScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  // AsyncStorage.clear();
  // queryCache.clear();
  const user = useStore((state) => state.user);
  const {
    isLoading: isLoadingListings,
    data: listingsData,
    error: listingsError,
  } = useQuery(["listings", user?.uid], () => fetchListings(user?.uid));

  const handlePress = (listing: any) => {
    navigation.navigate("ViewListing", {
      id: listing.id,
      ownerId: listing.ownerId,
    });
    // navigation.navigate("CreateStack", {
    //   screen: "ViewListing",
    //   params: {
    //     screen: "ViewListing",
    //     id,
    //   },
    // });
  };

  const updateSearch = (search: any) => {
    setSearch(search);
  };
  function Item({ item }: any) {
    return (
      <Swiper style={{ height: 300 }}>
        {item.images.map((image: any, index: any) => {
          return (
            <TouchableOpacity key={index} onPress={() => handlePress(item)} style={styles.item}>
              <FastImage source={{ uri: image }} style={styles.image} />
            </TouchableOpacity>
          );
        })}
      </Swiper>
    );
  }

  const handleProfilePress = (uid: any) => {
    navigation.navigate("ViewProfile", {
      ownerId: uid,
    });
  };

  const filteredListings = listingsData?.filter((listing: any) => {
    if (search === "") {
      return listing;
    }
    return listing.name.toLowerCase().includes(search.toLowerCase());
  });

  const openSearchbar = () => {
    setSearch("");
    setSearchOpen(!searchOpen);
  };

  return (
    <>
      {isLoadingListings ? (
        <Text>Loading</Text>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>INSTAHEAT</Text>
          </View>
          {/* <TextInput value={search} onChangeText={updateSearch} style={styles.detailsAnswer} /> */}
          <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={openSearchbar}>
              <FastImage source={require("../assets/Search_Icon.png")} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          {searchOpen ? (
            <SearchBar lightTheme={true} placeholder="Type Here..." onChangeText={updateSearch} value={search} />
          ) : null}
          <FlashList
            horizontal={false}
            estimatedItemSize={200}
            data={filteredListings}
            renderItem={({ item }: any) => (
              <>
                <TouchableOpacity onPress={() => handleProfilePress(item.owner.uid)} style={styles.userInfo}>
                  <FastImage source={{ uri: item.owner.userImage || defaultProfile }} style={styles.userImage} />
                  <Text style={styles.sellerName}>{item.owner.sellerName}</Text>
                </TouchableOpacity>
                <Item item={item} />
                <View style={styles.detailsContainer}>
                  <View style={styles.nameConditionSizeContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.conditionAndSize}>
                      {item.condition} Size {item.size}
                    </Text>
                  </View>
                  <View style={styles.priceCanTradeContainer}>
                    <Text style={styles.price}>${item.price}</Text>
                    {item.canTrade ? <FastImage style={styles.canTrade} source={require("../Trade.png")} /> : null}
                  </View>
                </View>
              </>
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    alignItems: "center",
    // paddingBottom: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  conditionAndSize: {
    fontSize: 16,
    color: "gray",
  },
  nameConditionSizeContainer: {
    width: "80%",
  },
  priceCanTradeContainer: {
    width: "20%",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    padding: 10,
  },
  title: {
    marginVertical: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
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
    width: "100%",
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
});
