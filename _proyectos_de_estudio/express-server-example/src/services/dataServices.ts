import exampleData from './data.json'
import type { ExampleReport, NewExampleReport, NonSensitiveExampleReport } from '../models/types'
import { AppError } from '../middlewares/appError'

const reports: ExampleReport[] = exampleData as ExampleReport[]

export const getEntries = (): ExampleReport[] => reports

export const findById = (id: number): ExampleReport => {
  const entry = reports.find(r => r.id === id)
  if (!entry) throw new AppError(`Example report with id ${id} not found`, 404)
  return entry
}

export const getEntriesWithoutSensitiveInfo = (): NonSensitiveExampleReport[] => {
  return reports.map(({ id, date, weather, visibility , comment }) => ({
    id, date, weather, visibility , comment 
  }))
}

export const addEntry = (newReport: NewExampleReport): ExampleReport => {
  const report = {
    id: Math.max(...reports.map(r => r.id)) + 1,
    ...newReport
  }
  reports.push(report)
  return report
}

export const deleteEntry = (id: number): void => {
  const index = reports.findIndex(r => r.id === id)
  if (index === -1) throw new AppError(`Example report with id ${id} not found`, 404)
  reports.splice(index, 1)
}

export const updateEntry = (id: number, updatedReport: NewExampleReport): ExampleReport => {
  const index = reports.findIndex(r => r.id === id)
  if (index === -1) throw new AppError(`Example report with id ${id} not found`, 404)

  const newUpdatedReport: ExampleReport = { id, ...updatedReport }
  reports[index] = newUpdatedReport
  return newUpdatedReport
}
