"use server"

import { createServiceClient } from "@/lib/supabase/server"

export type SubscribeState = {
  ok: boolean
  message: string
}

/** Сохраняет email в таблицу subscribers (Supabase) */
export async function subscribeEmail(
  _prev: SubscribeState | null,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Введите корректный email" }
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from("subscribers").insert({ email })

    if (error) {
      // Уникальный email уже есть
      if (error.code === "23505") {
        return { ok: true, message: "Вы уже в списке — скоро напишем ✨" }
      }
      console.error("[subscribe]", error.message)
      return { ok: false, message: "Не удалось сохранить. Попробуйте позже." }
    }

    return { ok: true, message: "Готово! Проверьте почту — ссылка уже летит ✨" }
  } catch (err) {
    console.error("[subscribe]", err)
    return {
      ok: false,
      message: "Сервер не настроен. Проверьте .env.local и ключи Supabase.",
    }
  }
}
