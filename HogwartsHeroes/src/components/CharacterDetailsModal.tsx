import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { CharacterDetails } from '../api/characterApi';

interface CharacterDetailsModalProps {
  isVisible: boolean;
  character: CharacterDetails | null;
  loading: boolean;
  onClose: () => void;
}

const CharacterDetailsModal: React.FC<CharacterDetailsModalProps> = ({ isVisible, character, loading, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            character && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {character.image ? (
                  <Image 
                    source={{ uri: character.image }} 
                    style={styles.characterImage}
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}

                <Text style={styles.title}>{character.name}</Text>

                <Text style={[styles.subtitle, styles.label]}>House:</Text>
                <Text style={styles.subtitle}>{character.house || 'Unknown'}</Text>

                <Text style={[styles.subtitle, styles.label]}>Species:</Text>
                <Text style={styles.subtitle}>{character.species || 'Unknown'}</Text>

                <Text style={[styles.subtitle, styles.label]}>Blood Status:</Text>
                <Text style={styles.subtitle}>{character.blood_status || 'Unknown'}</Text>

                <Text style={[styles.subtitle, styles.label]}>Born:</Text>
                <Text style={styles.subtitle}>{character.born || 'Unknown'}</Text>

                <Text style={[styles.subtitle, styles.label]}>Died:</Text>
                <Text style={styles.subtitle}>{character.died || 'Unknown'}</Text>

                <Text style={[styles.subtitle, styles.label]}>Patronus:</Text>
                <Text style={styles.subtitle}>{character.patronus || 'Unknown'}</Text>

                <Text style={[styles.subtitle, styles.label]}>Alias Names:</Text>
                <Text style={styles.subtitle}>{character.alias_names.length > 0 ? character.alias_names.join(', ') : 'None'}</Text>

                <Text style={styles.wikiLink}>
                  <TouchableOpacity onPress={() => Linking.openURL(character.wiki)}>
                    <Text style={styles.wikiLinkText}> {character.wiki}</Text>
                  </TouchableOpacity>
                </Text>

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '85%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    alignItems: 'center',    
  },
  characterImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 75,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    backgroundColor: '#ddd', 
    borderRadius: 75, 
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  wikiLink: {
    fontSize: 16,
    marginTop: 10,
    color: '#007BFF', 
  },
  wikiLinkText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CharacterDetailsModal;
