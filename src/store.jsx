import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { DEFAULT_PLAN, DEFAULT_SETTINGS } from './data.js'
import { mondayOf } from './lib.js'

// Comptes et données : localStorage uniquement (pas de serveur). Chaque compte a ses propres données.
const K_USERS = 'ucjm:users'
const K_SESSION = 'ucjm:session'
const kData = (id) => `ucjm:data:${id}`

const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb } }
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
async function hashPw(pw, salt) {
  if (!globalThis.crypto?.subtle) throw new Error('Le navigateur ne permet pas de sécuriser le mot de passe (HTTPS requis).')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits'])
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, key, 256))
}

export const freshData = () => ({
  plan: [...DEFAULT_PLAN],
  start: mondayOf(),
  settings: { ...DEFAULT_SETTINGS },
  done: {},     // { 'AAAA-MM-JJ': { r: idRecette, p: personnes } }
  bdone: {},    // petits-déjeuners faits : { date: { b: idPetitDej, p } }
  bought: {},   // quantité achetée par ingrédient (dans son unité)
  unchecked: {},// articles décochés de la liste de courses
  total: ''     // total réel du panier saisi par l'utilisateur
})

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => read(K_SESSION, null))
  const [data, setData] = useState(() => (session ? { ...freshData(), ...read(kData(session), {}) } : null))

  // Sauvegarde automatique des données du compte connecté.
  useEffect(() => { if (session && data) write(kData(session), data) }, [session, data])

  const user = session ? read(K_USERS, []).find((u) => u.id === session) : null

  const register = useCallback(async (name, email, pw) => {
    const users = read(K_USERS, [])
    email = email.trim().toLowerCase()
    if (!name.trim()) return 'Entre ton nom.'
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Courriel invalide.'
    if (pw.length < 8) return 'Mot de passe : 8 caractères minimum.'
    if (users.some((u) => u.email === email)) return 'Un compte existe déjà avec ce courriel.'
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const u = { id: crypto.randomUUID(), name: name.trim(), email, salt: b64(salt), hash: await hashPw(pw, salt) }
    write(K_USERS, [...users, u])
    write(kData(u.id), freshData())
    write(K_SESSION, u.id)
    setData(freshData()); setSession(u.id)
    return null
  }, [])

  const login = useCallback(async (email, pw) => {
    const u = read(K_USERS, []).find((x) => x.email === email.trim().toLowerCase())
    if (!u || (await hashPw(pw, unb64(u.salt))) !== u.hash) return 'Courriel ou mot de passe incorrect.'
    write(K_SESSION, u.id)
    setData({ ...freshData(), ...read(kData(u.id), {}) }); setSession(u.id)
    return null
  }, [])

  const logout = useCallback(() => { localStorage.removeItem(K_SESSION); setSession(null); setData(null) }, [])

  const deleteAccount = useCallback(() => {
    write(K_USERS, read(K_USERS, []).filter((u) => u.id !== session))
    localStorage.removeItem(kData(session))
    logout()
  }, [session, logout])

  const update = useCallback((fn) => setData((d) => fn(structuredClone(d))), [])

  return <Ctx.Provider value={{ user, data, update, register, login, logout, deleteAccount }}>{children}</Ctx.Provider>
}
