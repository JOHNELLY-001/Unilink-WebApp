<template>
  <div class="pg-wrap">
    <div class="two" style="margin-bottom:0; align-items:flex-start; gap:16px">

      <!-- MAIN FEED -->
      <div style="flex:1.4; display:flex; flex-direction:column; gap:12px">

        <!-- Composer -->
        <div class="pnl composer">
          <div class="cmp-top">
            <div class="av cmp-av">{{ auth.initials }}</div>
            <div class="cmp-input-wrap" @click="composerOpen=true">
              <span v-if="!composerOpen" class="cmp-placeholder">Share something with the community…</span>
              <textarea v-else class="cmp-textarea" placeholder="What's on your mind?" v-model="newPost" ref="textareaRef" rows="3" autofocus></textarea>
            </div>
          </div>
          <div class="cmp-footer" v-if="composerOpen">
            <div class="fb-fields">
              <button v-for="cat in categories.slice(1)" :key="cat" class="fb-field-btn sm" :class="{ active: newCategory===cat }" @click="newCategory=cat">{{ cat }}</button>
            </div>
            <div class="cmp-actions">
              <button class="bo cmp-btn" @click="composerOpen=false; newPost=''; newCategory=''">Cancel</button>
              <button class="ba cmp-btn" @click="submitPost" :disabled="!newPost.trim() || posting">{{ posting ? 'Posting…' : 'Post' }}</button>
            </div>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="pnl" style="padding:10px 14px">
          <div class="fb-fields">
            <button v-for="cat in categories" :key="cat" class="fb-field-btn sm" :class="{ active: activeCategory===cat }" @click="activeCategory=cat">{{ cat }}</button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="sk-col"><div class="sk-item sk-pulse" v-for="n in 3" :key="n"></div></div>

        <!-- Posts -->
        <div v-else>
          <div class="pnl post-card" v-for="post in posts" :key="post.id" style="margin-bottom:10px">
            <div class="post-top">
              <div class="av post-av">{{ post.initials }}</div>
              <div class="post-meta">
                <div class="post-name">{{ post.name }}</div>
                <div class="post-sub">{{ post.school }} · {{ post.time }}</div>
              </div>
              <span class="tg t-b post-cat">{{ post.category }}</span>
            </div>
            <p class="post-body">{{ post.body }}</p>
            <div class="post-footer">
              <button class="post-action" :class="{ liked: post.liked }" @click="handleLike(post)">
                ❤️ {{ post.likes }} {{ post.liked ? 'Liked' : 'Like' }}
              </button>
              <button class="post-action">💬 {{ post.replies }} Replies</button>
              <button class="post-action">🔗 Share</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div style="flex:0.6; display:flex; flex-direction:column; gap:12px; min-width:0">
        <div class="pnl">
          <div class="sh"><span class="st">Community Stats</span></div>
          <div class="comm-stat" v-for="s in commStats" :key="s.label">
            <div class="cs-val" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="cs-label">{{ s.label }}</div>
          </div>
        </div>
        <div class="pnl">
          <div class="sh"><span class="st">Community Guidelines</span></div>
          <ul class="guidelines">
            <li v-for="g in guidelines" :key="g">{{ g }}</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getPosts, getCategories, likePost, createPost } from '../api/community.js'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const posts = ref([])
const categories = ref([])
const loading = ref(true)
const activeCategory = ref('All')
const composerOpen = ref(false)
const newPost = ref('')
const newCategory = ref('')
const posting = ref(false)
const textareaRef = ref(null)

onMounted(async () => {
  const [p, c] = await Promise.all([getPosts(), getCategories()])
  posts.value = p; categories.value = c; loading.value = false
})

watch(activeCategory, async (cat) => {
  loading.value = true
  posts.value = await getPosts({ category: cat === 'All' ? '' : cat })
  loading.value = false
})

async function handleLike(post) {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  await likePost(post.id)
}

async function submitPost() {
  if (!newPost.value.trim()) return
  posting.value = true
  const post = await createPost({ initials: auth.initials, name: auth.fullName, school: auth.user?.school || 'UniLink', body: newPost.value, category: newCategory.value || 'General' })
  posts.value.unshift(post)
  newPost.value = ''; newCategory.value = ''; composerOpen.value = false; posting.value = false
}

const commStats = [
  { value: '2,400+', label: 'Active Students', color: 'var(--acc)' },
  { value: '180+',   label: 'Mentors Online',  color: 'var(--teal)' },
  { value: '5,800+', label: 'Posts This Month', color: 'var(--gold)' },
]

const guidelines = [
  '✅ Be respectful and kind',
  '✅ Share accurate information',
  '✅ Support fellow students',
  '❌ No spam or promotions',
  '❌ No personal attacks',
]
</script>

<style scoped>
.composer { }
.cmp-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
.cmp-av { width:30px; height:30px; font-size:10px; flex-shrink:0; }
.cmp-input-wrap { flex:1; min-width:0; }
.cmp-placeholder { font-size:13px; color:var(--tx4); cursor:text; display:block; padding:8px 12px; background:var(--page); border:1.5px solid var(--brd); border-radius:var(--r-md); }
.cmp-textarea { width:100%; background:var(--page); border:1.5px solid var(--acc); border-radius:var(--r-md); padding:8px 12px; font-size:13px; color:var(--tx); outline:none; resize:none; font-family:var(--font-body); }
.cmp-footer { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; }
.cmp-actions { display:flex; gap:7px; }
.cmp-btn { padding:6px 16px; font-size:12px; }
.fb-fields { display:flex; flex-wrap:wrap; gap:5px; }
.fb-field-btn { padding:5px 13px; border-radius:20px; border:1.5px solid var(--brd); background:var(--white); font-size:11.5px; font-weight:600; color:var(--tx2); cursor:pointer; transition:all var(--t-fast); }
.fb-field-btn.sm { padding:3px 10px; font-size:10.5px; }
.fb-field-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.fb-field-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.sk-col { display:flex; flex-direction:column; gap:10px; }
.sk-item { height:120px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse { background:var(--brd); animation:pulse 1.6s ease infinite; }
.post-top { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.post-av { width:30px; height:30px; font-size:10px; flex-shrink:0; }
.post-name { font-size:13px; font-weight:700; color:var(--tx); }
.post-sub { font-size:10.5px; color:var(--tx4); }
.post-cat { margin-left:auto; flex-shrink:0; }
.post-body { font-size:13px; color:var(--tx2); line-height:1.7; margin-bottom:10px; }
.post-footer { display:flex; gap:14px; border-top:1px solid var(--brd); padding-top:8px; }
.post-action { background:none; border:none; font-size:11.5px; color:var(--tx3); cursor:pointer; font-weight:600; padding:0; transition:color var(--t-fast); }
.post-action:hover { color:var(--acc); }
.post-action.liked { color:var(--coral); }
.comm-stat { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--brd); }
.comm-stat:last-child { border-bottom:none; }
.cs-val { font-family:var(--font-display); font-size:16px; font-weight:700; }
.cs-label { font-size:11.5px; color:var(--tx3); }
.guidelines { padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:6px; }
.guidelines li { font-size:12px; color:var(--tx2); }
@media(max-width:768px){ .two { flex-direction:column; } }
</style>