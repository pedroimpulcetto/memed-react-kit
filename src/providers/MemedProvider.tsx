import React, { ReactElement, ReactNode, RefObject, useCallback, useMemo, useState } from 'react'

import { ModuleOptions, Patient, Workplace } from '../domain'
import { useScriptLoader, useSetupCommands, useActionButtonBind, useSetupPatient, useSetupWorkplace } from '../hooks'
import MemedContext from '../contexts/MemedContext'

import { cleanUp, showPrescription, hidePrescription } from '../actions'

interface MemedContextProviderProps {
  children: ReactNode
  color?: string
  scriptSrc?: string
  scriptId?: string
}

export default function MemedProvider(props: MemedContextProviderProps): ReactElement {
  const {
    children,
    color = '#00B8D6',
    scriptSrc = 'https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js',
    scriptId = 'memedScript'
  } = props

  const [doctorToken, setDoctorToken] = useState('')
  const [patient, setPatient] = useState<Patient>()
  const [workplace, setWorkplace] = useState<Workplace>()
  const [actionRef, setActionRef] = useState<RefObject<HTMLButtonElement>>()
  const [options, setOptions] = useState<ModuleOptions>()

  const { prescriptionLoaded } = useScriptLoader({
    doctorToken,
    color,
    scriptSrc,
    scriptId
  })

  const { patientSet } = useSetupPatient({ patient, prescriptionLoaded })
  const { workplaceSet } = useSetupWorkplace({ workplace, prescriptionLoaded })

  useSetupCommands({ options, prescriptionLoaded })

  useActionButtonBind({ patientSet, workplaceSet, actionRef })

  const onLogout = useCallback(() => {
    if (prescriptionLoaded) {
      cleanUp(scriptId)
    }
  }, [scriptId, prescriptionLoaded])

  const loadingModule = useMemo(() => {
    return !prescriptionLoaded || !patientSet || !workplaceSet
  }, [prescriptionLoaded, patientSet, workplaceSet])

  const contextValue = useMemo(
    () => ({
      setDoctorToken,
      setPatient,
      setWorkplace,
      setActionRef,
      onLogout,
      loadingModule,
      showPrescription,
      hidePrescription,
      setOptions
    }),
    [onLogout, loadingModule]
  )

  return <MemedContext.Provider value={contextValue}>{children}</MemedContext.Provider>
}
