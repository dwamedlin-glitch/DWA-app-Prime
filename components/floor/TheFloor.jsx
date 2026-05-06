import React from "react";

// The Floor - Discussion Forum component
// Largest screen component with posts, replies, photos, moderation
// All state and handlers passed as props from DWAApp
const TheFloor = (props) => {
  // ── THE FLOOR (Discussion Forum) ──
  const formatFloorTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const RoleBadge = ({ role: r }) => {
    if (r === "officer") return <span style={{ ...f(9, 700), color: "#c4a44e", background: "#3d2a08", padding: "1px 7px", borderRadius: 10, letterSpacing: ".05em" }}>OFFICER</span>;
    if (r === "steward") return <span style={{ ...f(9, 700), color: "#e8b84b", background: "#2a1f0a", padding: "1px 7px", borderRadius: 10, letterSpacing: ".05em" }}>STEWARD</span>;
    return null;
  };

  const LocationTag = ({ loc }) => {
    const isFlorence = loc === "Florence";
    return <span style={{ ...f(9, 600), color: isFlorence ? "#7ab87a" : "#9b8ec4", background: isFlorence ? "#1a2a1a" : "#1f1a2a", padding: "1px 7px", borderRadius: 10, letterSpacing: ".03em" }}>{isFlorence ? "FLR" : "JC"}</span>;
  };

  const handleFloorPost = async () => {
    if (isCurrentUserBanned) {
      setToastMsg({ message: "You've been suspended from The Floor." });
      return;
    }
    const text = floorPostRef.current?.value?.trim();
    if (!text && !floorPhoto) return;
    if (floorPostRef.current) floorPostRef.current.value = "";
    setFloorPosting(true);
    try {
      let photoURL = null;
      if (floorPhoto) {
        photoURL = await uploadFloorPhoto(floorPhoto);
      }
      await createFloorPost({
        author: currentUserName,
        uid: currentUid,
        location: currentUserLocation,
        role: currentUserRole,
        text: text || "",
        photoURL,
      });
      setFloorPhoto(null);
      setFloorPhotoPreview(null);
    } catch (e) {
      console.error("Failed to post:", e);
      setToastMsg({ message: "Failed to post. Try again." });
    } finally {
      setFloorPosting(false);
    }
  };

  const handleFloorPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToastMsg({ message: "Photo must be under 5MB." });
      return;
    }
    setFloorPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFloorPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleBanUser = (authorName, postId) => {
    setConfirmModal({
      title: `Ban ${authorName}?`,
      message: `${authorName} will no longer be able to post on The Floor. They can still use the app. An officer can unban them later.`,
      danger: true,
      onConfirm: async () => {
        try {
          await banUser({ name: authorName, bannedBy: currentUserName });
          if (postId) await deleteFloorPost(postId);
          setToastMsg({ message: `${authorName} banned from The Floor` });
        } catch (e) {
          console.error("Failed to ban:", e);
          setToastMsg({ message: "Failed to ban. Try again." });
        }
      }
    });
  };

  const handleUnbanUser = (userName) => {
    setConfirmModal({
      title: `Unban ${userName}?`,
      message: `${userName} will be able to post on The Floor again.`,
      onConfirm: async () => {
        try {
          await unbanUser(userName);
          setToastMsg({ message: `${userName} unbanned` });
        } catch (e) {
          console.error("Failed to unban:", e);
          setToastMsg({ message: "Failed to unban. Try again." });
        }
      }
    });
  };

  const handleFloorReply = async (postId) => {
    const text = floorReplyRef.current?.value?.trim();
    if (!text) return;
    if (floorReplyRef.current) floorReplyRef.current.value = "";
    setFloorReplyTo(null);
    try {
      await addFloorReply(postId, {
        author: currentUserName,
        location: currentUserLocation,
        role: currentUserRole,
        text,
      });
    } catch (e) {
      console.error("Failed to reply:", e);
      setToastMsg({ message: "Failed to reply. Try again." });
    }
  };

  const handleFloorDelete = (postId, replyId) => {
    setConfirmModal({
      title: "Delete this post?",
      message: "This will remove the post from The Floor.",
      danger: true,
      onConfirm: async () => {
        try {
          if (replyId) {
            const post = floorPosts.find(p => p.id === postId);
            const replyToDelete = post?.replies?.find(r => r.id === replyId);
            if (replyToDelete) await deleteFloorReply(postId, replyToDelete);
            setToastMsg({ message: "Reply deleted" });
          } else {
            await deleteFloorPost(postId);
            setToastMsg({ message: "Post deleted" });
          }
        } catch (e) {
          console.error("Failed to delete:", e);
          setToastMsg({ message: "Failed to delete. Try again." });
        }
      }
    });
  };

  const startFloorEdit = (post) => {
    setFloorEditingPost(post.id);
    setFloorEditText(post.text || "");
    setTimeout(() => floorEditRef.current?.focus(), 100);
  };

  const cancelFloorEdit = () => {
    setFloorEditingPost(null);
    setFloorEditText("");
  };

  const handleFloorEditSave = async (postId) => {
    const newText = (floorEditRef.current?.value || "").trim();
    if (!newText) {
      setToastMsg({ message: "Post can't be empty." });
      return;
    }
    try {
      await editFloorPost(postId, { text: newText, edited: true, editedAt: Date.now() });
      setFloorEditingPost(null);
      setFloorEditText("");
      setToastMsg({ message: "Post updated" });
    } catch (e) {
      console.error("Failed to edit:", e);
      setToastMsg({ message: "Failed to edit. Try again." });
    }
  };

  const TheFloor = () => (
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
          <button onClick={handleFloorPost} disabled={floorPosting} style={{ ...btnGold(), width: "auto", padding: "10px 24px", ...f(12, 400, 'bebas'), letterSpacing: ".1em", opacity: floorPosting ? 0.5 : 1 }}>{floorPosting ? "POSTING…" : "POST"}</button>
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
                onClick={() => { setFloorReplyTo(floorReplyTo === post.id ? null : post.id); setFloorReplyText(""); }}
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

  const Grievance = () => {
    if (grievanceSubmitted) return (
      <div className="rise" style={{ flex: 1, ...col(0), alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", marginBottom: 20 }}>
          <SectionIcon icon="check" size={32} />
        </div>
        <div style={{ ...f(32, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em", marginBottom: 12 }}>Submitted!</div>
        <div style={{ ...f(14, 400, 'serif'), color: "var(--text2)", lineHeight: 1.7, fontStyle: "italic", textAlign: "center", marginBottom: 24 }}>
          Your grievance has been recorded and forwarded to the Union. A steward will be in touch within 5 business days.
        </div>
        <div className="gold-rule" style={{ width: "100%", marginBottom: 16 }} />
        <button style={{ ...btnOutline }} onClick={resetGrievance}>Submit Another</button>
      </div>
    );

    return (
      <div className="rise" style={{ padding: "16px 14px 30px", ...col(0) }}>
        <div style={{ ...card({ padding: "18px", marginBottom: 20 }), textAlign: "center" }}>
          <div style={{ ...f(22, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>GRIEVANCE FORM</div>
          <div style={{ ...f(14, 600), color: "var(--gold)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 4 }}>Dairy Workers Association</div>
          <div className="gold-rule" style={{ marginTop: 12, marginBottom: 0 }} />
        </div>
        {grievanceError && <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 8, padding: "12px 16px", ...f(12, 400, 'serif'), color: "var(--red)", marginBottom: 16, fontStyle: "italic" }}>Please fill in all required fields marked with *</div>}
        <div style={{ ...card({ padding: "18px" }), ...col(18), marginBottom: 20 }}>
          <div style={col(6)}>
            <label style={lbl}>Today's Date *</label>
            <input type="date" style={{ ...inp(grievanceError && !incidentDate), width: "100%" }} value={incidentDate} onChange={e => setIncidentDate(e.target.value)} />
          </div>
          <div style={col(6)}>
            <label style={lbl}>Name of Union Employee *</label>
            <input style={{ ...inp(grievanceError && !supervisorName), width: "100%" }} placeholder="Employee's full name" value={supervisorName} onChange={e => setSupervisorName(e.target.value)} />
          </div>
          <div style={col(6)}>
            <label style={lbl}>Date of Grievance *</label>
            <input type="date" style={{ ...inp(grievanceError && !incidentTime), width: "100%" }} value={incidentTime} onChange={e => setIncidentTime(e.target.value)} />
          </div>
          <div className="gold-rule" />
          <div style={col(6)}>
            <label style={lbl}>Explanation of Grievance *</label>
            <textarea style={{ ...inp(grievanceError && !description.trim()), width: "100%", minHeight: 120, resize: "vertical", lineHeight: 1.6 }} placeholder="Describe the issue in detail…" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="gold-rule" />
          <div style={col(6)}>
            <label style={lbl}>Proposed Solution</label>
            <textarea style={{ ...inp(), width: "100%", minHeight: 100, resize: "vertical", lineHeight: 1.6 }} placeholder="What remedy are you seeking?" value={remedy} onChange={e => setRemedy(e.target.value)} />
          </div>
          <div className="gold-rule" />
          <div style={col(6)}>
            <label style={lbl}>Witness</label>
            <input style={{ ...inp(), width: "100%" }} placeholder="Name(s) of any witnesses" value={witnesses} onChange={e => setWitnesses(e.target.value)} />
          </div>
          <div style={col(6)}>
            <label style={lbl}>Signature</label>
            <input style={{ ...inp(), width: "100%" }} placeholder="Type your full name to sign" value={contractArticle} onChange={e => setContractArticle(e.target.value)} />
          </div>
        </div>
        <div key={shakeKey} className={grievanceError ? "shake" : ""}>
          <button style={btnGold()} onClick={handleGrievance}>SUBMIT GRIEVANCE</button>
        </div>
      </div>
    );
  };

};

export default TheFloor;
