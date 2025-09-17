export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy'

export type Visibility = 'great' | 'good' | 'ok' | 'poor' | 'average' | 'bad'

export interface ExampleReport {
  id: number
  date: string
  weather: Weather
  visibility: Visibility
  cost: number
  comment: string
}

export type NonSensitiveExampleReport = Omit<ExampleReport, 'cost'>

export type NewExampleReport = Omit<ExampleReport, 'id'>