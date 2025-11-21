import { useState, useEffect } from 'react'
import { useAdminHeader } from '@/context/AdminHeaderContext'
import { getCardList, ApiCard, createCard, CreateCardRequest, deleteCard, updateCard, UpdateCardRequest } from '@/lib/adminApi'
import * as XLSX from 'xlsx'
import { Button } from '@/components/admin/ui/button'
import { Checkbox } from '@/components/admin/ui/checkbox'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/admin/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'

interface Card {
  id: number
  card_name: string
  annual_fee_1: string
  annual_fee_2: string
  file_id: number // cardImageFileId
  card_banner_file_id: number // cardBannerFileId
  card_benef: string
  card_type: string
  card_svc: string
}

type SortOrder = 'asc' | 'desc'

export function CardManagement() {
  const { setActions } = useAdminHeader()
  const t = (key: string): string => {
    const map: Record<string, string> = {
      'table.id': 'ID',
      'table.cardName': '카드명',
      'table.annualFee1': '연회비(국내전용)',
      'table.annualFee2': '연회비(해외겸용)',
      'table.cardImageFileId': '카드 이미지 파일ID',
      'table.cardBannerFileId': '카드 배너 파일ID',
      'table.cardBenefit': '카드혜택',
      'table.cardType': '카드타입',
      'table.cardService': '카드서비스',
      'table.cardUrl': '카드URL',
      'table.link': '링크',
      'table.edit': 'EDIT',
      'table.delete': 'DELETE',
      'table.create': 'CREATE',
      'table.export': 'EXPORT',
    }
    return map[key] || key
  }
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 필터 상태
  const [filterCardType, setFilterCardType] = useState<string>('all')
  const [filterCardSvc, setFilterCardSvc] = useState<string>('all')

  // 카드 리스트 로컬 상태로 관리
  const [cardsState, setCardsState] = useState<Card[]>([])

  // API 응답을 Card 형식으로 변환
  const convertApiCardToCard = (apiCard: ApiCard): Card => {
    // cardSvc 변환: "YES" -> "T", "NO" -> "F" 등
    let cardSvc = apiCard.cardSvc
    if (cardSvc === 'YES') {
      cardSvc = 'T'
    } else if (cardSvc === 'NO') {
      cardSvc = 'F'
    }
    
    return {
      id: apiCard.id,
      card_name: apiCard.cardName,
      annual_fee_1: apiCard.annualFee1,
      annual_fee_2: apiCard.annualFee2,
      file_id: apiCard.cardImageFileId,
      card_banner_file_id: apiCard.cardBannerFileId,
      card_benef: apiCard.cardBenef,
      card_type: apiCard.cardType.toLowerCase(), // "CREDIT" -> "credit"
      card_svc: cardSvc,
    }
  }

  // 카드 목록 조회
  const fetchCards = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getCardList()
      
      if (response.statusCode === 200 && Array.isArray(response.resultData)) {
        const convertedCards = response.resultData.map(convertApiCardToCard)
        setCardsState(convertedCards)
      } else {
        setError(response.resultMsg || '카드 목록을 불러오는데 실패했습니다.')
        setCardsState([])
      }
    } catch (err: any) {
      console.error('카드 목록 조회 에러:', err)
      
      const errorMessage = 
        err?.response?.data?.errorResultMsg ||
        err?.response?.data?.resultMsg ||
        err?.message ||
        '카드 목록을 불러오는데 실패했습니다.'
      
      setError(errorMessage)
      setCardsState([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  // 생성 모달 상태 및 폼
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState<Omit<Card, 'id'>>({
    card_name: '',
    annual_fee_1: '',
    annual_fee_2: '',
    file_id: 0,
    card_banner_file_id: 0,
    card_benef: '',
    card_type: 'credit',
    card_svc: 'T',
  })
  const [cardImageFile, setCardImageFile] = useState<File | null>(null)
  const [cardBannerFile, setCardBannerFile] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // 수정 모달 상태 및 폼
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCardId, setEditingCardId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Card>({
    id: 0,
    card_name: '',
    annual_fee_1: '',
    annual_fee_2: '',
    file_id: 0,
    card_banner_file_id: 0,
    card_benef: '',
    card_type: 'credit',
    card_svc: 'T',
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [editCardImageFile, setEditCardImageFile] = useState<File | null>(null)
  const [editCardBannerFile, setEditCardBannerFile] = useState<File | null>(null)

  const toggleAll = (checked: boolean): void => {
    if (checked) {
      setSelectedIds(cardsState.map((c) => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleOne = (id: number, checked: boolean): void => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const handleSort = (): void => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleEdit = (id: number) => {
    const card = cardsState.find((c) => c.id === id)
    if (!card) {
      setError('카드를 찾을 수 없습니다.')
      return
    }

    setEditingCardId(id)
    setEditForm({
      ...card,
    })
    setEditCardImageFile(null)
    setEditCardBannerFile(null)
    setIsEditDialogOpen(true)
    setError(null)
  }

  const handleEditSave = async () => {
    // 유효성 검사
    if (!editForm.card_name.trim()) {
      setError('카드명을 입력해주세요.')
      return
    }

    if (!editingCardId) {
      setError('수정할 카드 ID가 없습니다.')
      return
    }

    try {
      setIsUpdating(true)
      setError(null)

      // 카드 정보 준비 (cardSvc를 YES/NO로 변환)
      const cardInfo: UpdateCardRequest = {
        cardId: editingCardId,
        cardName: editForm.card_name,
        cardBenefit: editForm.card_benef,
        cardType: editForm.card_type.toUpperCase(), // "credit" -> "CREDIT"
        cardSvc: editForm.card_svc === 'T' ? 'YES' : editForm.card_svc === 'F' ? 'NO' : editForm.card_svc,
        annualFee1: editForm.annual_fee_1,
        annualFee2: editForm.annual_fee_2,
      }

      const result = await updateCard(
        cardInfo,
        editCardImageFile || undefined,
        editCardBannerFile || undefined
      )

      if (result.success) {
        // 성공 시 목록 새로고침
        await fetchCards()
        setIsEditDialogOpen(false)
        setEditingCardId(null)
        setEditCardImageFile(null)
        setEditCardBannerFile(null)
      } else {
        setError(result.error || '카드 수정에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('카드 수정 에러:', err)
      setError('카드 수정 중 오류가 발생했습니다.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return
    }

    try {
      setError(null)
      const result = await deleteCard(id)

      if (result.success) {
        // 성공 시 목록 새로고침
        await fetchCards()
        // 선택된 항목에서 제거
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
      } else {
        setError(result.error || '카드 삭제에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('카드 삭제 에러:', err)
      setError('카드 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
    setCardImageFile(null)
    setCardBannerFile(null)
    setError(null)
  }

  const handleCreateSave = async () => {
    // 유효성 검사
    if (!createForm.card_name.trim()) {
      setError('카드명을 입력해주세요.')
      return
    }
    if (!cardImageFile) {
      setError('카드 이미지를 선택해주세요.')
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      // 카드 정보 준비 (cardSvc를 YES/NO로 변환)
      const cardInfo: CreateCardRequest = {
        cardName: createForm.card_name,
        cardBenefit: createForm.card_benef,
        cardType: createForm.card_type.toUpperCase(), // "credit" -> "CREDIT"
        cardSvc: createForm.card_svc === 'T' ? 'YES' : createForm.card_svc === 'F' ? 'NO' : createForm.card_svc,
        annualFee1: createForm.annual_fee_1,
        annualFee2: createForm.annual_fee_2,
      }

      const result = await createCard(cardInfo, cardImageFile, cardBannerFile || undefined)

      if (result.success) {
        // 성공 시 목록 새로고침
        await fetchCards()
        setIsCreateDialogOpen(false)
        // 폼 초기화
        setCreateForm({
          card_name: '',
          annual_fee_1: '',
          annual_fee_2: '',
          file_id: 0,
          card_banner_file_id: 0,
          card_benef: '',
          card_type: 'credit',
          card_svc: 'T',
        })
        setCardImageFile(null)
        setCardBannerFile(null)
      } else {
        setError(result.error || '카드 등록에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('카드 등록 에러:', err)
      setError('카드 등록 중 오류가 발생했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleExport = () => {
    // 선택된 항목이 있으면 선택된 항목만, 없으면 전체 데이터
    const dataToExport = selectedIds.length > 0
      ? cardsState.filter(c => selectedIds.includes(c.id))
      : cardsState

    // 엑셀 데이터 준비
    const excelData = dataToExport.map(card => ({
      [t('table.id')]: card.id,
      [t('table.cardName')]: card.card_name,
      [t('table.annualFee1')]: card.annual_fee_1,
      [t('table.annualFee2')]: card.annual_fee_2,
      [t('table.cardImageFileId')]: card.file_id,
      [t('table.cardBannerFileId')]: card.card_banner_file_id,
      [t('table.cardBenefit')]: card.card_benef,
      [t('table.cardType')]: card.card_type,
      [t('table.cardService')]: card.card_svc === 'T' ? 'YES' : card.card_svc === 'F' ? 'NO' : card.card_svc,
    }))

    // 워크시트 생성
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // 워크북 생성
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '카드 목록')
    
    // 엑셀 파일 다운로드
    XLSX.writeFile(wb, `카드_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  useEffect(() => {
    setActions({
      onCreate: handleCreate,
      onExport: handleExport,
      onRefresh: fetchCards,
    })

    return () => {
      setActions({})
    }
  }, [setActions])

  // 필터링된 카드 목록
  const filteredCards = cardsState.filter((card) => {
    // 카드 타입 필터
    if (filterCardType !== 'all' && card.card_type !== filterCardType) {
      return false
    }
    
    // 카드 서비스 필터 (YES/NO를 T/F로 변환하여 비교)
    if (filterCardSvc !== 'all') {
      const cardSvcValue = filterCardSvc === 'YES' ? 'T' : filterCardSvc === 'NO' ? 'F' : filterCardSvc
      if (card.card_svc !== cardSvcValue) {
        return false
      }
    }
    
    return true
  })

  const sortedCards = [...filteredCards].sort((a, b) => {
    return sortOrder === 'asc' ? a.id - b.id : b.id - a.id
  })

  // 필터 초기화
  const handleResetFilters = () => {
    setFilterCardType('all')
    setFilterCardSvc('all')
  }

  // 고유한 카드 타입 목록 추출
  const uniqueCardTypes = Array.from(new Set(cardsState.map(card => card.card_type)))
  // 고유한 카드 서비스 목록 추출 (T/F를 YES/NO로 변환)
  const uniqueCardSvcs = Array.from(new Set(cardsState.map(card => {
    if (card.card_svc === 'T') return 'YES'
    if (card.card_svc === 'F') return 'NO'
    return card.card_svc
  })))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 w-full">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6 w-full">
      {error && (
        <div className="absolute top-4 left-1/2 z-50 p-4 rounded-lg border -translate-x-1/2 bg-red-900/20 border-red-500/50">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a] text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">카드 추가</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">새 카드를 등록하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="card_name" className="text-gray-700 dark:text-gray-300">카드명</Label>
              <Input id="card_name" value={createForm.card_name} onChange={(e) => setCreateForm({ ...createForm, card_name: e.target.value })} className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="annual_fee_1" className="text-gray-700 dark:text-gray-300">연회비(국내전용)</Label>
              <Input id="annual_fee_1" value={createForm.annual_fee_1} onChange={(e) => setCreateForm({ ...createForm, annual_fee_1: e.target.value })} className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="annual_fee_2" className="text-gray-700 dark:text-gray-300">연회비(해외겸용)</Label>
              <Input id="annual_fee_2" value={createForm.annual_fee_2} onChange={(e) => setCreateForm({ ...createForm, annual_fee_2: e.target.value })} className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card_benef" className="text-gray-700 dark:text-gray-300">카드혜택</Label>
              <Input id="card_benef" value={createForm.card_benef} onChange={(e) => setCreateForm({ ...createForm, card_benef: e.target.value })} className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card_type" className="text-gray-700 dark:text-gray-300">카드타입</Label>
              <Select value={createForm.card_type} onValueChange={(value) => setCreateForm({ ...createForm, card_type: value })}>
                <SelectTrigger className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectValue placeholder="카드 타입 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectItem value="credit">CREDIT</SelectItem>
                  <SelectItem value="debit">DEBIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card_svc" className="text-gray-700 dark:text-gray-300">카드서비스</Label>
              <Select value={createForm.card_svc} onValueChange={(value) => setCreateForm({ ...createForm, card_svc: value })}>
                <SelectTrigger className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectValue placeholder="카드 서비스 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectItem value="T">YES</SelectItem>
                  <SelectItem value="F">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card_image" className="text-gray-700 dark:text-gray-300">카드 이미지 *</Label>
              <Input
                id="card_image"
                type="file"
                accept="image/*"
                onChange={(e) => setCardImageFile(e.target.files?.[0] || null)}
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white"
              />
              {cardImageFile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">선택된 파일: {cardImageFile.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card_banner" className="text-gray-700 dark:text-gray-300">카드 배너 이미지 (선택)</Label>
              <Input
                id="card_banner"
                type="file"
                accept="image/*"
                onChange={(e) => setCardBannerFile(e.target.files?.[0] || null)}
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white"
              />
              {cardBannerFile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">선택된 파일: {cardBannerFile.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsCreateDialogOpen(false)
                setCardImageFile(null)
                setCardBannerFile(null)
                setError(null)
              }} 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              disabled={isCreating}
            >
              취소
            </Button>
            <Button 
              onClick={handleCreateSave} 
              className="text-white bg-blue-600 hover:bg-blue-700"
              disabled={isCreating}
            >
              {isCreating ? '등록 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a] text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">카드 수정</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">카드 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit_card_name" className="text-gray-700 dark:text-gray-300">카드명</Label>
              <Input 
                id="edit_card_name" 
                value={editForm.card_name} 
                onChange={(e) => setEditForm({ ...editForm, card_name: e.target.value })} 
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_annual_fee_1" className="text-gray-700 dark:text-gray-300">연회비(국내전용)</Label>
              <Input 
                id="edit_annual_fee_1" 
                value={editForm.annual_fee_1} 
                onChange={(e) => setEditForm({ ...editForm, annual_fee_1: e.target.value })} 
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_annual_fee_2" className="text-gray-700 dark:text-gray-300">연회비(해외겸용)</Label>
              <Input 
                id="edit_annual_fee_2" 
                value={editForm.annual_fee_2} 
                onChange={(e) => setEditForm({ ...editForm, annual_fee_2: e.target.value })} 
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_card_benef" className="text-gray-700 dark:text-gray-300">카드혜택</Label>
              <Input 
                id="edit_card_benef" 
                value={editForm.card_benef} 
                onChange={(e) => setEditForm({ ...editForm, card_benef: e.target.value })} 
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a]" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_card_type" className="text-gray-700 dark:text-gray-300">카드타입</Label>
              <Select 
                value={editForm.card_type} 
                onValueChange={(value) => setEditForm({ ...editForm, card_type: value })}
              >
                <SelectTrigger className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectValue placeholder="카드 타입 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectItem value="credit">CREDIT</SelectItem>
                  <SelectItem value="debit">DEBIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_card_svc" className="text-gray-700 dark:text-gray-300">카드서비스</Label>
              <Select 
                value={editForm.card_svc} 
                onValueChange={(value) => setEditForm({ ...editForm, card_svc: value })}
              >
                <SelectTrigger className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectValue placeholder="카드 서비스 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                  <SelectItem value="T">YES</SelectItem>
                  <SelectItem value="F">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_card_image" className="text-gray-700 dark:text-gray-300">카드 이미지 파일 (선택 - 교체 시에만 업로드)</Label>
              <Input
                id="edit_card_image"
                type="file"
                accept="image/*"
                onChange={(e) => setEditCardImageFile(e.target.files?.[0] || null)}
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white"
              />
              {editCardImageFile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">선택된 파일: {editCardImageFile.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_card_banner" className="text-gray-700 dark:text-gray-300">카드 배너 이미지 파일 (선택 - 교체 시에만 업로드)</Label>
              <Input
                id="edit_card_banner"
                type="file"
                accept="image/*"
                onChange={(e) => setEditCardBannerFile(e.target.files?.[0] || null)}
                className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#2a2a2a] text-gray-900 dark:text-white"
              />
              {editCardBannerFile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">선택된 파일: {editCardBannerFile.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingCardId(null)
                setEditCardImageFile(null)
                setEditCardBannerFile(null)
                setError(null)
              }} 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button 
              onClick={handleEditSave} 
              className="text-white bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? '수정 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-[#1a1a1a]">
                      <th className="px-4 py-3 w-12 text-left">
                        <Checkbox
                          checked={sortedCards.length > 0 && selectedIds.length === sortedCards.length && sortedCards.every(card => selectedIds.includes(card.id))}
                          onCheckedChange={toggleAll}
                          className="border-gray-300 dark:border-gray-600"
                        />
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">
                        <button onClick={handleSort} className="flex gap-1 items-center transition-colors hover:text-gray-900 dark:hover:text-white">
                          {t('table.id')}
                          <svg
                            className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.cardName')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.annualFee1')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.annualFee2')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.cardImageFileId')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.cardBannerFileId')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.cardBenefit')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.cardType')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-left text-gray-600 whitespace-nowrap dark:text-gray-400">{t('table.cardService')}</th>
                      <th className="px-4 py-3 text-sm font-medium text-right text-gray-600 dark:text-gray-400"></th>
                    </tr>
                  </thead>
          <tbody>
            {sortedCards.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {cardsState.length === 0 
                    ? '카드 데이터가 없습니다.' 
                    : '필터 조건에 맞는 카드가 없습니다.'}
                </td>
              </tr>
            ) : (
              sortedCards.map((card) => (
                <tr key={card.id} className="border-b border-gray-200 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#0f0f0f] transition-colors">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedIds.includes(card.id)}
                    onCheckedChange={(checked) => toggleOne(card.id, checked as boolean)}
                    className="border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.id}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-white">{card.card_name}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.annual_fee_1}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.annual_fee_2}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.file_id}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.card_banner_file_id}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.card_benef}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">{card.card_type}</td>
                <td className="px-4 py-3 text-sm text-black whitespace-nowrap dark:text-gray-300">
                  {card.card_svc === 'T' ? 'YES' : card.card_svc === 'F' ? 'NO' : card.card_svc}
                </td>
                <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] gap-1.5"
                              onClick={() => handleEdit(card.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {t('table.edit')}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-[#1a1a1a] gap-1.5"
                              onClick={() => handleDelete(card.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {t('table.delete')}
                            </Button>
                          </div>
                        </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      
      {/* 우측 필터 사이드바 */}
      <div className="flex-shrink-0 w-64">
        <div className="sticky top-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
          <div className="mb-4">
            <h3 className="mb-4 text-base font-semibold text-white">필터</h3>
            
            {/* 카드 타입 필터 */}
            <div className="mb-4">
              <Label htmlFor="filter-card-type" className="block mb-2 text-sm font-medium text-white">
                카드 타입
              </Label>
              <Select value={filterCardType} onValueChange={setFilterCardType}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-10 w-full text-sm">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectItem value="all">전체</SelectItem>
                  {uniqueCardTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* 카드 서비스 필터 */}
            <div className="mb-4">
              <Label htmlFor="filter-card-svc" className="block mb-2 text-sm font-medium text-white">
                카드 서비스
              </Label>
              <Select value={filterCardSvc} onValueChange={setFilterCardSvc}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-10 w-full text-sm">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectItem value="all">전체</SelectItem>
                  {uniqueCardSvcs.map((svc) => (
                    <SelectItem key={svc} value={svc}>
                      {svc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* 필터 초기화 버튼 */}
            {(filterCardType !== 'all' || filterCardSvc !== 'all') && (
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full px-4 h-9 border-[#2a2a2a] hover:bg-[#1a1a1a] bg-transparent text-white text-sm mb-4"
              >
                필터 초기화
              </Button>
            )}
            
            {/* 필터 결과 표시 */}
            <div className="pt-4 border-t border-[#1a1a1a]">
              <div className="text-sm text-gray-400">
                <div>전체: {cardsState.length}개</div>
                <div className="mt-1 font-medium text-white">필터: {filteredCards.length}개</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
