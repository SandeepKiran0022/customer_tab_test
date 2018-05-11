export const TaxGroups = {
  'Intra State Tax': {
    description: 'For sale to another state (IGST)',
    taxes: ['IGST']
  },
  'Inter State Tax': {
    description: 'For sale within the state (GCST + SGST)',
    taxes: ['CGST', 'SGST']
  }
}

export const TaxPercentages = [5, 12, 18, 28]