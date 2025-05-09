export interface Patient {
  idExterno: string
  nome: string
  endereco: string
  cidade: string
  telefone?: string // (DDD) XXXXX-XXXX
  peso?: number
  altura?: number
  data_nascimento?: string // dd/mm/YYYY
}
