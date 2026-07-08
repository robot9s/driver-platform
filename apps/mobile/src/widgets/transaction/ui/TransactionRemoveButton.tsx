import {IconTrash} from '@tabler/icons-react-native'
import {useState} from 'react'
import {ActivityIndicator} from 'react-native'
import {Button} from '@shared/ui/button'

export function TransactionRemoveButton({onDelete}: TFormSubmitButtonProps) {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      size="icon"
      variant="secondary"
      onPress={() => {
        // It is better to use local state so that the lister is displayed instantly
        // since sometimes global state works with a delay
        setLoading(true)
        onDelete(() => setLoading(false))
      }}
    >
      {loading ? <ActivityIndicator /> : <IconTrash className="size-5 text-secondary-foreground" />}
    </Button>
  )
}

// TYPES

type TFormSubmitButtonProps = {
  onDelete: (onFinish: () => void) => void
}
