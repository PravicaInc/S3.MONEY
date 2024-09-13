export type DistributorForm1Values = {
  companyName: string;
  country: string;
  businessType: string;
  logo?: string;
}

export type DistributorForm2Values = {
  issuerId: string;
  projectId: string;
}

export type DistributorFormValues = DistributorForm1Values & DistributorForm2Values;
