export interface IMajor {
  title: string
  teams: ITeam[]
}

export interface ITeam {
  logo: string
  name: string
  players: IPlayer[]
}

export interface IPlayer {
  name: string
  wasFound: boolean
  isCoach?: boolean
}
