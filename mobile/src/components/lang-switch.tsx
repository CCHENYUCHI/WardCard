import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LANG_CODES, LANGUAGES, setLearnLang, useLearnLang } from '@/constants/learn-lang';

/** 🇪🇸 / 🇩🇪 pill that switches the learning language (deck), like the web navbar */
export default function LangSwitch() {
  const lang = useLearnLang();
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup" accessibilityLabel="學習語言">
      {LANG_CODES.map((code) => {
        const active = code === lang;
        return (
          <Pressable
            key={code}
            onPress={() => setLearnLang(code)}
            style={[styles.option, active && styles.active]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={LANGUAGES[code].name}>
            <Text style={styles.flag}>{LANGUAGES[code].flag}</Text>
            <Text style={[styles.code, active && styles.codeActive]}>{code.toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    padding: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  active: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  flag: { fontSize: 14 },
  code: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  codeActive: { color: '#0f172a' },
});
