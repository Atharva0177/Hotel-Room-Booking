import { format } from 'date-fns';

export const formatDate = (value) => format(new Date(value), 'dd MMM yyyy');
