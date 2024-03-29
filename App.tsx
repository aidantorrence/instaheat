import { Image, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { icons } from "./utils/icons";
import EditProfileScreen from "./Screens/EditProfileScreen";
import ViewListingScreen from "./Screens/ViewListingScreen";
import ViewProfileScreen from "./Screens/ViewProfileScreen";
import EditListingScreen from "./Screens/EditListingScreen";
import { useLayoutEffect } from "react";
import HomeScreen from "./Screens/HomeScreen";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import CreateListingScreen from "./Screens/CreateListingScreen";
import SignInScreen from "./Screens/SignInScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import useAuthentication, { useStore } from "./utils/firebase/useAuthentication";
import PaymentScreen from "./Screens/PaymentScreen";
import ShippingDetailsScreen from "./Screens/ShippingDetailsScreen";
import ItemsWantedScreen from "./Screens/ItemsWantedScreen";
import OfferScreen from "./Screens/OfferScreen";
import ItemsToTradeScreen from "./Screens/ItemsToTradeScreen";
import TradeSummaryScreen from "./Screens/TradeSummaryScreen";
import CheckoutScreen from "./Screens/CheckoutScreen";
import { fetchUser } from "./data/api";
import CreateSellerScreen from "./Screens/CreateSellerScreen";
import OrderConfirmationScreen from "./Screens/OrderConfirmationScreen";
import SetupPaymentsScreen from "./Screens/SetupPaymentsScreen";
import MessagesScreen from "./Screens/MessagesScreen";
import ViewOfferScreen from "./Screens/ViewOffersScreen";
import TradePaymentsScreen from "./Screens/TradePaymentsScreen";
import * as Sentry from "sentry-expo";
import SettingsScreen from "./Screens/SettingsScreen";

Sentry.init({
  dsn: "https://4bbe7afd11774e9ab04ca8a6929a8796@o1411142.ingest.sentry.io/6749502",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function Icon({ imgSrc }: any) {
  return (
    <View style={{ paddingTop: 15 }}>
      <Image source={imgSrc} resizeMode="contain" style={{ width: 33, height: 33 }} />
    </View>
  );
}

const Stack = createStackNavigator();

export function CreateScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateListing" options={{ headerTitle: "Create a Listing" }} component={CreateListingScreen} />
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="EditProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="Settings" options={{ headerTitle: "", title: "" }} component={SettingsScreen} />
    </Stack.Navigator>
  );
}
function ProfileScreenStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="EditProfile" options={{ headerTitle: "", title: "", headerShown: true }} component={EditProfileScreen} />
      <Stack.Screen name="Settings" options={{ headerTitle: "", title: "" , headerShown: true}} component={SettingsScreen} />
    </Stack.Navigator>
  );
}
function PaymentScreenStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ShippingDetails" options={{ headerTitle: "", title: "" }} component={ShippingDetailsScreen} />
      <Stack.Screen name="Payment" options={{ headerTitle: "", title: "" }} component={PaymentScreen} />
      <Stack.Screen name="Offer" options={{ headerTitle: "", title: "" }} component={OfferScreen} />
      <Stack.Screen name="SetupPayments" options={{ headerTitle: "", title: "" }} component={SetupPaymentsScreen} />
      <Stack.Screen name="OrderConfirmation" options={{ headerTitle: "", title: "" }} component={OrderConfirmationScreen} />
      <Stack.Screen name="TradePayment" options={{ headerTitle: "", title: "" }} component={TradePaymentsScreen} />
    </Stack.Navigator>
  );
}
function TradeScreenStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ItemsWanted" options={{ headerTitle: "", title: "" }} component={ItemsWantedScreen} />
      <Stack.Screen name="ItemsToTrade" options={{ headerTitle: "", title: "" }} component={ItemsToTradeScreen} />
      <Stack.Screen name="TradeSummary" options={{ headerTitle: "", title: "" }} component={TradeSummaryScreen} />
      <Stack.Screen name="CreateListing" options={{ headerTitle: "Create a Listing" }} component={CreateListingScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App({ navigation, route }: any) {
  const user = useAuthentication();
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="HomeTabs" options={{ headerTitle: "", title: "" }} component={HomeTabs} />
          <Stack.Screen name="PaymentStack" options={{ headerTitle: "", title: "" }} component={PaymentScreenStackNavigation} />
          <Stack.Screen name="TradeStack" options={{ headerTitle: "", title: "" }} component={TradeScreenStackNavigation} />
          <Stack.Screen name="ViewListing" options={{ headerTitle: "", title: "" }} component={ViewListingScreen} />
          <Stack.Screen name="EditListing" options={{ headerTitle: "Edit Listing", title: "" }} component={EditListingScreen} />
          <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
          <Stack.Screen name="SignUp" options={{ headerTitle: "", title: "" }} component={SignUpScreen} />
          <Stack.Screen name="SignIn" options={{ headerTitle: "", title: "" }} component={SignInScreen} />
          {/* <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Sign Up" component={SignOutScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

function HomeTabs() {
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
  });
  return isLoading ? (
    <View>
      <Text>Loading</Text>
    </View>
  ) : (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {},
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.homeFocused : icons.home} />,
        }}
      />
      <Tab.Screen
        name="Offers"
        component={user ? ViewOfferScreen : SignUpScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.offerFocused : icons.offer} />,
        }}
      />
      <Tab.Screen
        name="CreateStack"
        component={!user ? SignUpScreen : !userData?.chargesEnabled ? CreateSellerScreen : CreateScreenStackNavigation}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.createFocused : icons.create} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={user ? MessagesScreen : SignUpScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.chatFocused : icons.chat} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={user ? ProfileScreenStackNavigation : SignUpScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.profileFocused : icons.profile} />,
        }}
      />
    </Tab.Navigator>
  );
}
