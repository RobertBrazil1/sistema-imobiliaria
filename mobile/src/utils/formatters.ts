export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatArea = (area: number): string => {
  return `${area} m²`;
};

export const formatAddress = (
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string
): string => {
  return `${street}, ${number} - ${neighborhood}, ${city} - ${state}`;
};

export const formatPropertyType = (type: string): string => {
  const types = {
    house: 'Casa',
    apartment: 'Apartamento',
    land: 'Terreno',
  };
  return types[type as keyof typeof types] || type;
};

export const formatFeatures = (features: string[]): string => {
  return features.join(' • ');
}; 