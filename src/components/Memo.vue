<template>
  <section class="alert alert-primary">
    <div class="form-control-group ">
      <label for="title" class="col-12 text-left h5">
        Title
      </label>
      <div class="row ml-0">
        <input type="text" name="title" id="title" class="form-control col-9" v-model="data.title" @focus="setFlg">
        <button @click="find" class="btn btn-primary col-2 ml-2">find</button>
      </div>
    </div>
    <div class="form-control-group mt-3">
      <label for="" class="col-12 text-left h5">
        Text
      </label>
      <textarea name="content" id="" class="form-control" v-model="data.content"></textarea>
    </div>
    <div>
      <button class="btn btn-info m-2" @click="insert">save</button>
      <transition name="del">
        <button class="btn btn-info m-2" v-if="data.seleFlg != false" @click="remove">delete</button>
      </transition>
    </div>
    <ul class="list-group">
      <li v-for="(item, i) in pageItems" :key="i" @click="select(item)" class="list-group-item list-group-item-action text-left">
        {{ item.title }} （{{ item.created }}）
      </li>
    </ul>
    <hr />
    <div>
      <span class="btn btn-secondary mr-2" @click="prev">&lt; prev</span>
      <span class="btn btn-secondary ml-2" @click="next">next &gt;</span>
    </div>
  </section>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const data = reactive({
      title: '',
      content: '',
      numPerPage: 5,
      findFlg: false,
      seleFlg: false,
      seleItem: null,
      store: useStore(),
    })

    // NOTE: フラグの初期化
    const setFlg = () => {
      if (data.findFlg.value || data.seleFlg != false) {
        data.findFlg = false
        data.seleFlg = false
        data.title = ''
        data.content = ''
      }
    }

    // NOTE: 項目の選択
    const select = (item) => {
      data.findFlg = false
      data.seleFlg = true
      data.title = item.title
      data.content = item.content
      data.seleItem = item
    }

    // NOTE: 検索の設定
    const find = () => {
      data.seleFlg = false
      data.findFlg = true
    }

    // NOTE: メモの追加
    const insert = () => {
      data.store.commit('insert',
        {
          title: data.title,
          content: data.content
        }
      )
      data.title = ''
      data.content = ''
    }

    // NOTE: 選択項目の削除
    const remove = () => {
      if (data.seleFlg) {
        data.store.commit('remove', data.seleItem)
        setFlg()
      }
    }

    // NOTE: 次のページ
    const next = () => {
      page.value++
    }

    // NOTE: 前のページ
    const prev = () => {
      page.value--
    }

    // NOTE: メモ全体
    const memo = computed(() => data.store.state.memo)

    // NOTE: ページの表示項目
    const pageItems = computed(function() {
      if (data.findFlg) {
        const rec = data.store.state.memo
        const arr = rec.reduce((acc, element) => {
          const isMatch = element.title.toLowerCase().indexOf(data.title.toLowerCase()) >= 0
          if (isMatch) {
            acc.push(element)
          }
          return acc
        }, [])
        return arr
      } else {
        return data.store.state.memo.slice(
          data.numPerPage * data.store.state.page,
          data.numPerPage * (data.store.state.page + 1)
        )
      }
    })
    console.log('pageItems', pageItems);

    // NOTE: 表示ページを表す値
    const page = computed({
      get: () => {
        return data.store.state.page
      },
      set: (p) => {
        const position = p > (data.store.state.memo.length -1) / data.numPerPage ? Math.ceil((data.store.state.memo.length - 1) / data.numPerPage) - 1 : p
        const pg = position < 0 ? 0 : position
        data.store.commit('setPage', pg)
      }
    })

    // NOTE: マウント時の処理
    onMounted(() => {
      data.store.commit('setPage', 0)
    })

    return {
      data,
      setFlg,
      select,
      find,
      insert,
      remove,
      next,
      prev,
      memo,
      pageItems,
      // page
    }
  },
}
</script>
