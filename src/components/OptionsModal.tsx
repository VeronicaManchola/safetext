import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Colors } from '@constants/colors';

type Option = {
  label: string;
  onPress: () => void;
};

type OptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  options: Option[];
};

export default function OptionsModal({ visible, onClose, options }: OptionsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {options.map((opt, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                    idx !== options.length - 1 && styles.optionDivider,
                  ]}
                  onPress={() => {
                    opt.onPress();
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  sheet: {
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionPressed: {
    backgroundColor: Colors.light.surface,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
