import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TextInput } from 'react-native';
import { getAllCharacters, searchCharacters, Character } from '../api/characterApi';

const CharacterListScreen = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadCharacters = async () => {
    if (loading || !hasMore) return;
  
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100)); 
  
      const newCharacters = await getAllCharacters();
      setCharacters((prev) => [...prev, ...newCharacters]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(newCharacters.length > 0);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const search = async () => {
        const result = await searchCharacters(searchQuery);
        setFilteredCharacters(result);
      };
      search();
    } else {
      setFilteredCharacters(characters); 
    }
  }, [searchQuery, characters]); 

  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search characters..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredCharacters.length === 0 && loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredCharacters}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id ? item.id : `${index}`}
          ListFooterComponent={renderFooter}
          onEndReached={loadCharacters}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 100,
    backgroundColor: '#f9f9f9',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  placeholder: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default CharacterListScreen;
