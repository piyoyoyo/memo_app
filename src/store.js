import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export const store = createStore({
  state: () => {
    return {
      memo: [],
      page: 0,
    }
  },
  mutations: {
    insert: (state, obj) => {
      const d = new Date()
      const fmt = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
      state.memo.unshift({
        title: obj.title,
        content: obj.content,
        created: fmt
      })
    },
    setPage: (state, p) => {
      state.page = p;
    },
    remove: (state, obj) => {
      for (let i = 0; i < state.memo.length; i++) {
        const ob = state.memo[i]
        const isSame = ob.title == obj.title && ob.content == obj.content && ob.created == obj.created
        if (isSame) {
          alert(`削除しました！ -- ${ob.title}`)
          state.memo.splice(i, 1)
          return
        }
      }
    },
  },
  plugins: [
    createPersistedState(),
  ],
})