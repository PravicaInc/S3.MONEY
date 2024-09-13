export type StablecoinIssuerForm2Values = {
  reserveBank: string;
  reserveCurrency: string;
  reserveBalance: number;
}

export type StablecoinIssuerForm1Values = {
  companyName: string;
  industryDomain: string;
  companyLocation: string;
}

export type StablecoinIssuerFormValues = StablecoinIssuerForm1Values & StablecoinIssuerForm2Values;
