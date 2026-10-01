import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, MarketingShell, Section } from '@/components/Marketing'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Typo from '@/components/Typo'
import { colors, spacingX } from '@/constants/theme'
import { successFeedback } from '@/utils/haptics'

export default function ContactScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!message.trim()) return
    successFeedback()
    setSent(true)
  }

  return (
    <MarketingShell
      eyebrow="Contact"
      title="Say hello"
      lede="Feature ideas, bug reports or licensing questions — all welcome."
    >
      <Section title="Send a message">
        <View style={styles.form}>
          <Input value={name} onChangeText={setName} placeholder="Your name" />
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={message}
            onChangeText={setMessage}
            placeholder="How can we help?"
            multiline
            style={styles.textarea}
          />
          <Button
            style={sent ? styles.sent : styles.send}
            onPress={submit}
            disabled={!message.trim()}
          >
            <Typo size={15} fontWeight="700" color={colors.black}>
              {sent ? 'Message queued' : 'Send message'}
            </Typo>
          </Button>
          {sent ? (
            <Typo size={12} color={colors.textMuted}>
              Thanks — the form is local for now, so nothing left your device. The API will
              deliver these once it is connected.
            </Typo>
          ) : null}
        </View>
      </Section>

      <Section title="Other ways" delay={100}>
        <Card>
          <Typo size={13} fontWeight="600">
            support@anijinx.app
          </Typo>
          <Typo size={12} color={colors.textMuted}>
            Typical reply within two working days.
          </Typo>
        </Card>
      </Section>
    </MarketingShell>
  )
}

const styles = StyleSheet.create({
  form: { gap: spacingX.x10 },
  textarea: { height: 110, paddingTop: 12, textAlignVertical: 'top' },
  send: { backgroundColor: colors.white },
  sent: { backgroundColor: colors.success },
})
