import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/home.style";
import { Image } from "expo-image";
import { API_URL } from "@/constant/api";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constant/colors";
import { formatPublisDate } from "@/lib/utils";
import Loader from "@/components/loader";

interface User {
  _id: string;
  username: string;
  profileImage: string;
}

interface Book {
  _id: string;
  title: string;
  image: string;
  user: User;
  rating: number;
  caption: string;
  createdAt: string;
  // Add any other properties that exist in your book objects
}

interface ApiResponse {
  success: boolean;
  books: Book[];
  totalPages: number;
  currentPage: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Home = () => {
  const { token } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      setBooks((prevBooks) =>
        pageNum === 1 ? data.books : [...prevBooks, ...data.books]
      );
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      if (refresh) {
        await sleep(800);
        setRefreshing(false);
      } else if (pageNum === 1) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page + 1);
    }
  };

  const renderRatingPicker = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          name={i <= rating ? "star" : "star-outline"}
          size={32}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            style={styles.avatar}
            source={{ uri: item.user.profileImage }}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          source={item.image}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingPicker(item.rating)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>
          Shared on {formatPublisDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  if (loading) return <Loader size={"large"} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm📗</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community{" "}
              <Text style={{ fontSize: 16 }}>👇</Text>
            </Text>
          </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a book!
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size={"small"}
              color={COLORS.primary}
            />
          ) : null
        }
      />
    </View>
  );
};

export default Home;
