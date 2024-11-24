import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import { getAllCharacters, getFilteredCharacters, getFilterFields, getCharacterDetails, Character, CharacterFilterParams, CharacterDetails } from '../api/characterApi';
import CharacterDetailsModal from '../components/CharacterDetailsModal';

const CharacterListScreen = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CharacterFilterParams>({});
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDetails | null>(null); 
  const [detailsLoading, setDetailsLoading] = useState(false); 

  const loadCharacters = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newCharacters = await getAllCharacters();
      setCharacters(newCharacters);
      setFilteredCharacters(newCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const filtered = await getFilteredCharacters({ ...filters, name: searchQuery });
      setFilteredCharacters(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (searchQuery.trim() || Object.keys(filters).length > 0) {
      applyFilters();
    }
  }, [searchQuery, filters]);

  const filterFields = getFilterFields();

  const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleCharacterPress = async (id: string) => {
    setDetailsLoading(true);
    try {
      const details = await getCharacterDetails(id); 
      setSelectedCharacter(details);      
    } catch (error) {
      console.error('Error fetching character details', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity onPress={() => handleCharacterPress(item.id)} style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
    </TouchableOpacity>
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

      <TouchableOpacity onPress={toggleFilters} style={styles.filtersButton}>
        <Text style={styles.filtersButtonText}>{filtersVisible ? 'Hide Filters' : 'Show Filters'}</Text>
      </TouchableOpacity>

      {filtersVisible && (
        <View style={styles.filterPanel}>
          {filterFields.map((field) => (
            <View key={field} style={styles.filterField}>
              <Text>{capitalize(field)}</Text>
              <TextInput
                style={styles.filterInput}
                placeholder={`Enter ${field}`}
                value={filters[field as keyof CharacterFilterParams] || ''}
                onChangeText={(value) => handleFilterChange(field, value)}
              />
            </View>
          ))}
          <Button title="Apply Filters" onPress={applyFilters} />
        </View>
      )}

      {filteredCharacters.length === 0 && loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredCharacters}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id ? item.id : `${index}`}
          ListFooterComponent={renderFooter}
        />
      )}

      <CharacterDetailsModal
        isVisible={!!selectedCharacter}
        character={selectedCharacter}
        loading={detailsLoading}
        onClose={() => setSelectedCharacter(null)} 
      />
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
  filtersButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filtersButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  filterPanel: {
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
  },
  filterField: {
    marginBottom: 10,
  },
  filterInput: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
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
