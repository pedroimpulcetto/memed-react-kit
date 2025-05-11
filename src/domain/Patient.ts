export interface Patient {
  idExterno: string
  nome: string
  endereco: string
  cidade: string
  telefone?: string // (DDD) XXXXX-XXXX
  peso?: number
  altura?: number
  dataNascimento?: string // dd/mm/YYYY
}
