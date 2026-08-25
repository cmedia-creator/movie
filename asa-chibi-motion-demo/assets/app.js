
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm";

const db = createClient(
  "https://wsdgypjmxjbbchmppxbx.supabase.co",
  "sb_publishable__i9jTvvIhats3RvQxVXJ3A_X-LU9Bpb",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);

const $ = (id) => document.getElementById(id);
const fieldIds = ["display_name","oshi_name","oshi_since","favorite_song","favorite_point","same_fan_stance","status_message","bio","slug"];

// backward compatibility for old saved themes
const themeMap = { minimal: "babymon", rap: "babymon" };

function escapeHtml(value = ""){
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function currentTheme(){
  const checked = document.querySelector('input[name="theme"]:checked');
  return checked ? checked.value : "heisei";
}
function collectFormData(){
  const data = {};
  fieldIds.forEach((id) => data[id] = $(id).value.trim());
  data.theme = currentTheme();
  data.is_public = $("is_public").checked;
  return data;
}
function profileMarkup(profile){
  const row = (label, value) => value ? `<div class="row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>` : "";
  return `
    <div class="top">
      <span>MY OSHI PROFILE</span>
      <span>♡ 推し活記録</span>
    </div>
    <div class="chero">
      <small>＼ WELCOME TO MY PROFILE ／</small>
      <h2>${escapeHtml(profile.display_name || "あなたの名前")}</h2>
      <div class="oshi">推し：<b>${escapeHtml(profile.oshi_name || "まだ秘密")}</b></div>
    </div>
    <div class="rows">
      ${row("推し歴", profile.oshi_since)}
      ${row("好きな曲", profile.favorite_song)}
      ${row("好きなところ", profile.favorite_point)}
      ${row("同担", profile.same_fan_stance)}
      ${row("一言", profile.status_message)}
    </div>
    ${profile.bio ? `<div class="bio"><span class="bioTitle">ABOUT ME</span>${escapeHtml(profile.bio)}</div>` : ""}
    <div class="stamp">♡ THANK YOU FOR VISITING ♡</div>
  `;
}
function applyTheme(card, theme){
  const normalized = themeMap[theme] || theme || "heisei";
  card.className = `card theme-${normalized}`;
}
function renderPreview(){
  const profile = collectFormData();
  const preview = $("preview");
  applyTheme(preview, profile.theme);
  preview.innerHTML = profileMarkup(profile);
  $("state").textContent = "編集中";
}
function showMessage(text, kind = "error"){
  const box = $("msg");
  box.textContent = text;
  box.classList.remove("hidden");
  box.style.background = kind === "success" ? "#eefbf2" : "#fff0f4";
  box.style.color = kind === "success" ? "#25723e" : "#aa2e56";
}
function hideMessage(){ $("msg").classList.add("hidden"); }

async function ensureUser(){
  const session = (await db.auth.getSession()).data.session;
  if (session?.user) return session.user;
  const { data, error } = await db.auth.signInAnonymously();
  if (error){
    if (/anonymous/i.test(error.message)){
      throw new Error("Supabaseの Authentication → Sign In / Providers → Anonymous をONにして、Save changesも押してください。");
    }
    throw error;
  }
  return data.user;
}
function setCopyButton(slug, isPublic){
  if (!slug || !isPublic) return;
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("p", slug);
  const btn = $("copyTop");
  btn.classList.remove("hidden");
  btn.onclick = () => copyText(url.toString(), btn);
}
async function copyText(text, button){
  try{
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = "コピーしました";
    setTimeout(() => button.textContent = old, 1200);
  }catch{
    prompt("コピーしてください", text);
  }
}
async function loadOwnProfile(){
  const session = (await db.auth.getSession()).data.session;
  if (!session?.user) return;
  const { data } = await db.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle();
  if (!data) return;
  fieldIds.forEach((id) => { if ($(id)) $(id).value = data[id] ?? ""; });
  $("is_public").checked = !!data.is_public;
  const theme = themeMap[data.theme] || data.theme || "heisei";
  const radio = document.querySelector(`input[name="theme"][value="${CSS.escape(theme)}"]`);
  if (radio) radio.checked = true;
  renderPreview();
  $("state").textContent = "保存済み";
  setCopyButton(data.slug, data.is_public);
}
async function saveProfile(event){
  event.preventDefault();
  hideMessage();
  const save = $("save");
  save.disabled = true;
  try{
    const profile = collectFormData();
    if (!profile.display_name || !profile.oshi_name || !profile.slug){
      throw new Error("必須項目を入力してください。");
    }
    if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(profile.slug)){
      throw new Error("公開URLは英小文字・数字・_・- を使って3〜30文字で入力してください。");
    }
    const user = await ensureUser();
    const { data, error } = await db.from("profiles").upsert({ ...profile, user_id: user.id }, { onConflict: "user_id" }).select().single();
    if (error){
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)){
        throw new Error("その公開URLはすでに使われています。");
      }
      throw error;
    }
    $("state").textContent = "保存済み";
    showMessage(profile.is_public ? "保存しました。公開URLを共有できます。" : "保存しました。現在は非公開です。", "success");
    setCopyButton(data.slug, data.is_public);
  }catch(error){
    console.error(error);
    showMessage(error.message || "保存に失敗しました。", "error");
    $("state").textContent = "保存失敗";
  }finally{
    save.disabled = false;
  }
}
async function loadPublicProfile(slug){
  $("editView").classList.add("hidden");
  $("publicView").classList.remove("hidden");
  const { data } = await db.from("profiles")
    .select("display_name,oshi_name,oshi_since,favorite_song,favorite_point,same_fan_stance,status_message,bio,theme,is_public")
    .eq("slug", slug).eq("is_public", true).maybeSingle();
  $("loading").classList.add("hidden");
  if (!data){
    $("notFound").classList.remove("hidden");
    return;
  }
  const publicCard = $("publicCard");
  applyTheme(publicCard, data.theme);
  publicCard.innerHTML = profileMarkup(data);
  $("publicWrap").classList.remove("hidden");
  const url = location.href;
  $("copyTop").classList.remove("hidden");
  $("copyTop").onclick = () => copyText(url, $("copyTop"));
  $("copyPublic").onclick = () => copyText(url, $("copyPublic"));
  document.title = `${data.display_name}の推しプロフ`;
}
function initEditor(){
  fieldIds.forEach((id) => {
    $(id).addEventListener("input", renderPreview);
    $(id).addEventListener("change", renderPreview);
  });
  document.querySelectorAll('input[name="theme"]').forEach((el) => el.addEventListener("change", renderPreview));
  $("is_public").addEventListener("change", renderPreview);
  $("form").addEventListener("submit", saveProfile);
  renderPreview();
  loadOwnProfile();
}
const slug = new URLSearchParams(location.search).get("p");
if (slug) loadPublicProfile(slug.trim().toLowerCase());
else initEditor();
