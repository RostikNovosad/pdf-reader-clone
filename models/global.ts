export interface DocumentData {
  Title: string
  Metadata: {
    Date: string
    ClientName: string
  },
  Sections: Section[]
}
export interface Section {
  Type: string
  Text?: string
  Headers?: string[]
  Rows?: string[][]
  Left?: string
  Right?: string
}