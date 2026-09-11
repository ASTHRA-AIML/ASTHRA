export interface Activity {
  id: string
  title: string
  date: string
  imageUrl: string
  shortDescription?: string
  fullDescription?: string
  gallery?: string[]
}

export interface Newsletter {
  id: string
  title: string
  date: string
  coverUrl: string
  shortDescription?: string
  fullDescription?: string
  pdfUrl?: string
}

export interface CommitteeMember {
  name: string
  position: string
  imageUrl: string
  linkedinUrl: string
}

export interface CommitteeYear {
  year: string
  members: CommitteeMember[]
}
