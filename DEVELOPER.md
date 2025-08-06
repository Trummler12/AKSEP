## Important Terms
- **Fetch**: Download new commits from remotes into your local repo without altering your working files.
- **Pull**: Fetch then merge remote changes into your current branch in one step.
- **Push**: Upload your local commits to the remote repository.

!! PROVISIONAL COPY FROM PROGRAMMIERZEUGS - SOME INFORMATION DOESN'T FIT HERE !!

---

## 0. Deploy Files to Website

```bash
cd C:\Users\tnu01\Desktop\ProgrammierZeugs\zProjektZeugs
```
OR
```bash
cd C:\Users\tobia\Documents\GitHub\ProgrammierZeugs
```
then
```bash
npm run deploy
```

## 1. Visual Studio Code

> **Warning**: Any reset will discard uncommitted or unstashed changes. Commit or stash before proceeding.

1. **Fetch from All Remotes**  
   - Open **Source Control** (`Ctrl+Shift+G`) → click **…** → **Fetch**.  
   - Or install **Git Graph** extension and click its dotted-down-arrow icon.  
   - Alternatively, open Command Palette (`Ctrl+Shift+P`) → **Git: Fetch**.

2. **Select Your Branch**  
   - Click branch name in the Status Bar (bottom-left) → choose working branch.

3. **Reset to Main (Clean Slate)**  
   - **Via Command Palette**: `Ctrl+Shift+P` → **Git: Reset HEAD…** → select `origin/main`, choose **Hard**.  
   - **Or** install GitLens/Git Graph for a GUI **Reset → Hard** option under the **…** menu.

4. **Trigger Codex Suggestions**  
   - Place cursor on code →  
     - **Command Palette** (`Ctrl+Shift+P`) → type “Codex: Suggest Change”.  
     - **Or** hover on the code and press `Ctrl+.` (Quick Fix) → select **Codex: Suggest Change**.

5. **Stage & Commit**  
   - In **Source Control**, click the **+** on changed files/hunks.  
   - Enter commit message and click **✔**.

6. **Publish Branch & Create Pull Request**  
   - Click **Publish Branch** (first push; thereafter button becomes **Push**).  
   - When prompted, click **Create Pull Request** or use GitHub extension: **GitHub Pull Requests** panel.

7. **Repeat**  
   - For further work, return to step 1 to fetch the latest.

---

## 2. Bash-Based Workflow

1. **Reset to Main**  
   > **Warning**: Discards uncommitted work.  
```bash
git fetch origin main
git reset --hard origin/main
```

2. **Trigger Codex**  
   - If you have an npm script:  
```bash
npm run codex:review
```
   - Otherwise fall back to the CLI:  
```bash
npx codex review
# or, if globally installed:
codex review
```

3. **Stage, Commit & Push**  
```bash
git add .
git commit -m "chore: apply Codex suggestions"
# First-time push only:
git push --set-upstream origin <branch>
# Subsequent pushes:
git push
```

4. **Open PR in Browser**  
   - Manual: navigate to  
     `https://github.com/<owner>/<repo>/pull/new/<branch>`  
   - Optional CLI:  
```bash
gh pr create --fill
```  

---

## 3. JetBrains IntelliJ & Family

> **Warning**: Resetting will delete local changes unless committed or shelved.

1. **Fetch & Reset**  
   - Open **Git** tool window.  
   - Click the **Fetch** icon (down-arrow without merge badge).  
   - Or `Ctrl+Shift+A` → **Fetch**.  
   - Then open Branches popup (click branch name bottom-right) → right-click `origin/main` → **Reset Current Branch to Here** → **Hard**.

2. **Select Branch**  
   - Click branch indicator bottom-right → choose your working branch.

3. **Trigger Codex Suggestions**  
   - Place cursor on code →  
     - `Ctrl+Shift+A` → search **Codex: Suggest Change**.  
     - Or hover and click the light-bulb (“Show Intention Actions”) → select **Codex: Suggest Change**.

4. **Commit & Push with PR**  
   - Open **Commit** tool window → stage changes → click **Commit and Push**.  
   - In the Push dialog:  
     - Ensure **Create Pull Request** is checked.  
     - (First push will set upstream; later pushes are plain Push.)

5. **Review PR**  
   - Click link in the Push result or open **GitHub Pull Requests** tool window.

---

## 4. Deleting All Branches Except `main`

> **Warning**: This is destructive! Be certain you no longer need these branches.

### 4.1 Delete Local Branches

Run this in the VS Code integrated terminal (PowerShell):

```bash
# List + delete every local branch ≠ main
git branch |
  Where-Object { $_.Trim() -notmatch '^(\* )?main$' } |
  ForEach-Object { git branch -D $_.Trim() }
```

- `-D` force-deletes; use `-d` if you want Git to refuse on unmerged changes.

### 4.2 Delete Remote Branches

First, fetch & prune to ensure you have an up-to-date list:

```bash
git fetch origin --prune
```

Then delete every remote branch except `origin/main`:

```bash
git branch -r |
   Where-Object { $_ -notmatch 'origin/main' } |
   ForEach-Object {
      $b = $_.Trim().Replace('origin/','')
      git push origin --delete $b }
```

Finally, clean up stale refs:

```bash
git remote prune origin
```

---

After running these, both your **local** and **remote** will only have `main` remaining.

---

By following these environment-specific workflows—and using the CLI fallbacks—you’ll ensure smooth interaction with Codex whether you’re in VS Code, the terminal, or any JetBrains IDE.

## Additional Information
- Every AGENTS.md requires a trail newline for proper display on the Agent's side