"use client"

import { useMemo, useState } from "react"
import type { Document } from "@/lib/clinical-history/types"

interface UseDocumentsViewModelParams {
  documents: Document[]
  patientId: string
  onDocumentAdd?: (document: Partial<Document>) => void
  onDocumentSign?: (documentId: string) => void
}

export function useDocumentsViewModel({
  documents,
  patientId,
  onDocumentAdd,
  onDocumentSign,
}: UseDocumentsViewModelParams) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredDocuments = useMemo(
    () =>
      documents.filter((document) => {
        const titleMatches = document.title.toLowerCase().includes(normalizedSearch)
        const descriptionMatches = document.description
          ?.toLowerCase()
          .includes(normalizedSearch)
        const matchesSearch = !normalizedSearch || titleMatches || descriptionMatches
        const matchesType = filterType === "all" || document.type === filterType
        const matchesStatus = filterStatus === "all" || document.status === filterStatus

        return matchesSearch && matchesType && matchesStatus
      }),
    [documents, normalizedSearch, filterStatus, filterType]
  )

  const pendingCount = documents.filter((document) => document.status === "pending").length
  const signedCount = documents.filter((document) => document.status === "signed").length
  const expiredCount = documents.filter((document) => document.status === "expired").length

  const handleAddDocument = () => {
    onDocumentAdd?.({
      type: "consent",
      status: "pending",
      patientId,
    })
    setIsAddDialogOpen(false)
  }

  const openViewDialog = (document: Document) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const openSignDialog = (document: Document) => {
    setSelectedDocument(document)
    setIsSignDialogOpen(true)
  }

  const confirmSign = () => {
    if (selectedDocument) {
      onDocumentSign?.(selectedDocument.id)
    }

    setIsSignDialogOpen(false)
    setSelectedDocument(null)
  }

  const setViewDialogOpen = (isOpen: boolean) => {
    setIsViewDialogOpen(isOpen)
    if (!isOpen) {
      setSelectedDocument(null)
    }
  }

  const setSignDialogOpen = (isOpen: boolean) => {
    setIsSignDialogOpen(isOpen)
    if (!isOpen) {
      setSelectedDocument(null)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) {
      return false
    }

    const expDate = new Date(expirationDate)
    const now = new Date()
    const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return daysUntilExpiration <= 30 && daysUntilExpiration > 0
  }

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    selectedDocument,
    filteredDocuments,
    pendingCount,
    signedCount,
    expiredCount,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setViewDialogOpen,
    isSignDialogOpen,
    setSignDialogOpen,
    handleAddDocument,
    openViewDialog,
    openSignDialog,
    confirmSign,
    formatDate,
    isExpiringSoon,
  }
}
