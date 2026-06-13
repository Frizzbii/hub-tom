import { useRef } from 'react'
import { Game } from '@/types/game'

export function useTouchDrag(onDrop: (game: Game, tierId: string) => void) {
    const dragGame = useRef<Game | null>(null)
    const dragSourceTierId = useRef<string | null>(null)
    const clone = useRef<HTMLElement | null>(null)

    function onTouchStart(e: React.TouchEvent, game: Game, tierId: string | null = null) {
        dragGame.current = game
        dragSourceTierId.current = tierId

        const el = e.currentTarget as HTMLElement
        const c = el.cloneNode(true) as HTMLElement
        c.style.position = 'fixed'
        c.style.pointerEvents = 'none'
        c.style.opacity = '0.8'
        c.style.zIndex = '1000'
        c.style.width = el.offsetWidth + 'px'
        c.style.height = el.offsetHeight + 'px'
        document.body.appendChild(c)
        clone.current = c
    }

    function onTouchMove(e: React.TouchEvent) {
        if (!clone.current) return
        const touch = e.touches[0]
        clone.current.style.left = touch.clientX - 48 + 'px'
        clone.current.style.top = touch.clientY - 48 + 'px'
    }

    function onTouchEnd(e: React.TouchEvent) {
        if (clone.current) {
            document.body.removeChild(clone.current)
            clone.current = null
        }
        if (!dragGame.current) return

        const touch = e.changedTouches[0]
        const el = document.elementFromPoint(touch.clientX, touch.clientY)
        const tierEl = el?.closest('[data-tier-id]')
        const tierId = tierEl?.getAttribute('data-tier-id')

        if (tierId) onDrop(dragGame.current, tierId)

        dragGame.current = null
        dragSourceTierId.current = null
    }

    return { onTouchStart, onTouchMove, onTouchEnd }
}