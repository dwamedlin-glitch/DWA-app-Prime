import React from "react";

export default function TheFloor({ ctx }) {
  const {
    card,
    col,
    row,
    f,
    inp,
    btnGold,
    SectionIcon,
    darkMode,
    floorPosts,
    floorLoading,
    floorReplyTo,
    setFloorReplyTo,
    bannedUsers,
    floorPhoto,
    setFloorPhoto,
    floorPhotoPreview,
    setFloorPhotoPreview,
    floorPosting,
    floorPostRef,
    floorReplyRef,
    floorPhotoRef,
    isCurrentUserBanned,
    currentUserName,
    currentUid,
    isAdmin,
    isSteward,
    handleFloorPost,
    handleFloorPhotoSelect,
    handleFloorReply,
    handleBanUser,
    handleFloorDelete,
    getInitials,
    formatFloorTime,
    RoleBadge,
    LocationTag,
    startFloorEdit,
    SkeletonList,
  } = ctx;

  return (
    <div className="rise" style={{ padding: "16px 14px 30px", ...col(0) }}>
      <div style={{ ...card({ padding: "18px", marginBottom: 16 }), textAlign: "center" }}>
        <div style={{ ...f(22, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>THE FLOOR</div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>Talk with your union</div>
        <div className="gold-rule" style={{ marginTop: 12, marginBottom: 0 }} />
      </div>

      {/* Section 7 Welcome */}
      <div style={{ ...card({ padding: "16px 14px", marginBottom: 16, borderLeft: "3px solid var(--gold)" }) }}>
        <div style={{ ...row("center", 8), marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #a06b18, #c9922a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SectionIcon icon="shield" size={16} />
          </div>
          <div style={{ ...f(13, 700), color: "var(--gold)", letterSpacing: ".06em" }}>YOUR RIGHTS UNDER THE LAW</div>
        </div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.7, fontStyle: "italic" }}>
          <strong style={{ color: "var(--cream)", fontStyle: "normal" }}>Section 7 of the National Labor Relations Act</strong> guarantees that
          "Employees shall have the right to self-organization, to form, join, or assist labor organizations,
          to bargain collectively through representatives of their own choosing, and to engage in other concerted
          activities for the purpose of collective bargaining or other mutual aid or protection."
        </div>
        <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", marginTop: 8 }}>This is your space. Speak freely. We stand together.</div>
      </div>

      {/* New post */}
      {isCurrentUserBanned ? (
        <div style={{ ...card({ padding: "16px", marginBottom: 20, borderLeft: "3px solid var(--red)" }) }}>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--red)", fontStyle: "italic", lineHeight: 1.6 }}>
            You've been suspended from posting on The Floor. You can still read posts. Contact an officer if you believe this was a mistake.
          </div>
        </div>
      ) : (
      <div style={{ ...card({ padding: "14px", marginBottom: 20 }), ...col(10) }}>
        <div style={{ ...row("center", 8) }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ ...f(12, 600), color: "#c4a44e" }}>{getInitials(currentUserName)}</span>
          </div>
          <textarea
            ref={floorPostRef}
            style={{ ...inp(), minHeight: 48, resize: "vertical", lineHeight: 1.5, flex: 1 }}
            placeholder="What's on your mind?"
          />
        </div>
        <div style={{ ...row("center", 0), justifyContent: "flex-end", gap: 8 }}>
          <input ref={floorPhotoRef} type="file" accept="image/*" onChange={handleFloorPhotoSelect} style={{ display: "none" }} />
          <button onClick={() => floorPhotoRef.current?.click()} style={{ background: "none", border: "1px solid var(--seam)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--text3)" }} title="Add photo">
            <SectionIcon icon="doc" size={14} />
            <span style={{ ...f(11, 400, 'bebas'), letterSpacing: ".06em" }}>PHOTO</span>
          </button>
          <button onClick={handleFloorPost} disabled={floorPosting} style={{ ...btnGold(), width: "auto", minWidth: 110, padding: "10px 24px", ...f(12, 400, 'bebas'), letterSpacing: ".1em", opacity: floorPosting ? 0.5 : 1, transition: "opacity .15s ease" }}>{floorPosting ? "POSTING…" : "POST"}</button>
        </div>
        {floorPhotoPreview && (
          <div style={{ position: "relative", marginTop: 10 }}>
            <img src={floorPhotoPreview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, border: "1px solid var(--seam)" }} />
            <button onClick={() => { setFloorPhoto(null); setFloorPhotoPreview(null); if (floorPhotoRef.current) floorPhotoRef.current.value = ""; }} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", ...f(14, 700) }}>&times;</button>
          </div>
        )}
      </div>
      )}

      {/* Posts feed */}
      {floorLoading ? (
        <SkeletonList count={3} avatar={true} />
      ) : floorPosts.length === 0 ? (
        <div style={{ ...card({ padding: "24px", textAlign: "center" }) }}>
          <div style={{ ...f(14, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", lineHeight: 1.6 }}>No posts yet. Be the first to start a conversation.</div>
        </div>
      ) : (
      floorPosts.map(post => (
        <div key={post.id} style={{ ...card({ padding: "14px", marginBottom: 12 }) }}>
          {/* Post header */}
          <div style={{ ...row("center", 8), marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...f(12, 600), color: "#c4a44e" }}>{getInitials(post.author)}</span>
            </div>
            <div style={{ flex: 1, ...col(2) }}>
              <div style={{ ...row("center", 6) }}>
                <span style={{ ...f(13, 600), color: "var(--cream)" }}>{post.author}</span>
                <RoleBadge role={post.role} />
                <LocationTag loc={post.location} />
              </div>
              <span style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{formatFloorTime(post.time)}</span>
              <span style={{ ...f(9, 600), color: "var(--text3)", background: "var(--leather3)", padding: "1px 7px", borderRadius: 10, letterSpacing: ".03em" }}>Member since 2019</span>
            </div>
          </div>
          {/* Post body */}
          {post.text && <div style={{ ...f(13, 400, 'serif'), color: "var(--text)", lineHeight: 1.65, marginBottom: 4 }}>{post.text}</div>}
          {post.edited && (
            <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 8, opacity: 0.7 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 3, marginTop: -1 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              edited
            </div>
          )}
          {post.photoURL && (
            <div style={{ marginBottom: 10 }}>
              <img src={post.photoURL} alt="Post photo" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8, border: "1px solid var(--seam)", cursor: "pointer" }} onClick={() => window.open(post.photoURL, "_blank")} />
            </div>
          )}
          {/* Post actions */}
          <div style={{ ...row("center", 0), justifyContent: "space-between", borderTop: "1px solid var(--seam)", paddingTop: 8 }}>
            <div style={{ ...row("center", 12) }}>
              <span
                onClick={() => { setFloorReplyTo(floorReplyTo === post.id ? null : post.id); }}
                style={{ ...f(12, 500), color: "var(--gold)", cursor: "pointer" }}
              >
                Reply{post.replies.length > 0 ? ` (${post.replies.length})` : ""}
              </span>
              {(post.author === currentUserName || post.uid === currentUid) && (
                <span
                  onClick={() => startFloorEdit(post)}
                  style={{ ...f(12, 500), color: "var(--text3)", cursor: "pointer" }}
                >
                  Edit
                </span>
              )}
            </div>
            {(isAdmin || isSteward) && (
              <div style={{ ...row("center", 6) }}>
                {post.author !== currentUserName && post.uid !== currentUid && !bannedUsers.some(b => b.name === post.author) && (
                  <span onClick={() => handleBanUser(post.author, post.id)} style={{ ...f(11, 600), color: "#e87a7a", cursor: "pointer", background: "#2a1010", padding: "3px 10px", borderRadius: 8 }}>Ban</span>
                )}
                <span onClick={() => handleFloorDelete(post.id)} style={{ ...f(11, 600), color: "#a04040", cursor: "pointer", background: "#2a1010", padding: "3px 10px", borderRadius: 8 }}>Delete</span>
              </div>
            )}
          </div>

          {/* Replies */}
          {post.replies.length > 0 && (
            <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: "2px solid rgba(201,146,42,0.15)" }}>
              {post.replies.map(reply => (
                <div key={reply.id} style={{ marginBottom: 10, paddingTop: 6 }}>
                  <div style={{ ...row("center", 6), marginBottom: 4 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: darkMode ? "#1c1208" : "#f0ebe0", border: darkMode ? "1px solid #3d3218" : "1px solid #d0c5a8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(9, 600), color: "#c4a44e" }}>{getInitials(reply.author)}</span>
                    </div>
                    <span style={{ ...f(12, 600), color: "var(--cream)" }}>{reply.author}</span>
                    <RoleBadge role={reply.role} />
                    <LocationTag loc={reply.location} />
                    <span style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginLeft: "auto" }}>{formatFloorTime(reply.time)}</span>
                  </div>
                  <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, paddingLeft: 32 }}>{reply.text}</div>
                  {(isAdmin || isSteward) && (
                    <div style={{ paddingLeft: 32, marginTop: 4 }}>
                      <span onClick={() => handleFloorDelete(post.id, reply.id)} style={{ ...f(10, 600), color: "#a04040", cursor: "pointer" }}>Delete</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          {floorReplyTo === post.id && (
            <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: "2px solid rgba(201,146,42,0.3)", ...col(8) }}>
              <textarea
                ref={floorReplyRef}
                style={{ ...inp(), minHeight: 40, resize: "vertical", lineHeight: 1.5, fontSize: 12 }}
                placeholder="Write a reply..."
                autoFocus
              />
              <div style={{ ...row("center", 8), justifyContent: "flex-end" }}>
                <span onClick={() => setFloorReplyTo(null)} style={{ ...f(11, 500), color: "var(--text3)", cursor: "pointer" }}>Cancel</span>
                <button onClick={() => handleFloorReply(post.id)} style={{ ...btnGold(), width: "auto", padding: "7px 18px", ...f(11, 400, 'bebas'), letterSpacing: ".1em" }}>REPLY</button>
              </div>
            </div>
          )}
        </div>
      )))}

      {!floorLoading && floorPosts.length === 0 && null}
    </div>
  );
}
