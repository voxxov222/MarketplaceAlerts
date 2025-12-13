import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  containerPadded: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  mt4: { marginTop: theme.spacing.xs },
  mt8: { marginTop: theme.spacing.sm },
  mt16: { marginTop: theme.spacing.md },
  mt24: { marginTop: theme.spacing.lg },
  
  mb4: { marginBottom: theme.spacing.xs },
  mb8: { marginBottom: theme.spacing.sm },
  mb16: { marginBottom: theme.spacing.md },
  mb24: { marginBottom: theme.spacing.lg },
  
  ml4: { marginLeft: theme.spacing.xs },
  ml8: { marginLeft: theme.spacing.sm },
  ml16: { marginLeft: theme.spacing.md },
  
  mr4: { marginRight: theme.spacing.xs },
  mr8: { marginRight: theme.spacing.sm },
  mr16: { marginRight: theme.spacing.md },
});
