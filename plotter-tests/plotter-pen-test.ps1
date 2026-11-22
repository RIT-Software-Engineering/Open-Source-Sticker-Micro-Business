# ======================================================================
# PLOTTER PEN TEST (HP 7550A over RS-232)
# Draws a 10 cm L-shape one command at a time. After each command it asks
# the plotter whether that caused an error and where the pen is, and it
# stops at the first command the plotter doesn't get past.
# ======================================================================
#
# SETTINGS THAT WORK
#   Plotter front panel (interface menus, Level 2):
#     BAUD       9600
#     PARITY     8-BITS, OFF        (stop bits: 1, automatic above 110 baud)
#     DUPLEX     FULL
#     HANDSHAKE  NONE, DIRECT       <- changed from previous setting: XON/XOFF, DIRECT
#     DATA FLOW  REMOTE, STANDALONE
#     AUTO FEED  OFF                (see KNOWN ISSUES)
#
#   PC side: this script sets the port itself when it opens it. For
#   reference, `mode COM3` on a working setup shows:
#       Baud:            9600
#       Parity:          None
#       Data Bits:       8
#       Stop Bits:       1
#       Timeout:         ON
#       XON/XOFF:        OFF
#       CTS handshaking: OFF
#       DSR handshaking: OFF
#       DSR sensitivity: OFF
#       DTR circuit:     ON
#       RTS circuit:     ON
#
#   Cable: laptop USB -> USB-serial adapter (the black one)
#          -> null-modem cable (the grey one) -> plotter COMPUTER/MODEM port
#
# HOW TO RUN (from this folder)
#   powershell -ExecutionPolicy Bypass -File .\plotter-pen-test.ps1 -Port COM3 -Pen 1
#     -Port       serial port of the USB-serial adapter (default COM3)
#     -Pen        carousel slot of the pen to draw with, 1-8 (default 1)
#     -AppendLog  keep earlier runs in the log (see READING THE OUTPUT)
#
#   Finding your port: COM3 is only what Windows assigned on the laptop this
#   was tested on; yours may differ, and can change with a different USB
#   port. Check Device Manager > Ports (COM & LPT), or run
#   [System.IO.Ports.SerialPort]::GetPortNames() with the adapter plugged
#   in and again unplugged.
#
#   During the run: the script asks you to put one sheet in the single-sheet
#   feeder and press LOAD/UNLOAD, and waits up to 60 s. The plotter ignores
#   all drawing commands until a sheet is loaded. The run ends by ejecting
#   the sheet.
#
# READING THE OUTPUT
#   ->  what the computer sent, and what it means
#   <-  what the plotter answered, and what that means (indented with a tab)
#
#   Each run is also saved to plotter-log.txt in this folder. By default the
#   log is REWRITTEN on every run, so it only holds the last run. This
#   default was chosen deliberately: we don't expect to need the output of
#   previous runs. With -AppendLog, earlier runs are kept, newest at the top.
#
# CHECKS THE SCRIPT MAKES (each stops the run with an explanation)
#   - Port can't be opened (wrong -Port, adapter unplugged, port in use):
#     lists the serial ports that do exist.
#   - Plotter not answering at the start (switched off, cable unplugged,
#     wrong port, settings don't match).
#   - Commands left over from an earlier run that stopped early: press CLEAR
#     on the plotter (or power-cycle) and run again.
#   - Chosen pen slot is empty, based on the plotter's own pen sensing,
#     which matched the real carousel when tested. If the plotter doesn't
#     report its pens, the script only warns: check the slot by eye.
#   - USB-serial adapter unplugged mid-run. Tested during the 60 s paper
#     wait (2026-11-21); not yet tried during the drawing steps.
#
# KNOWN ISSUES
#   - AUTO FEED does not work (2026-11-21): with it on and paper in the
#     media tray, the display shows PAPER LOAD FAILED, even after reseating
#     the paper and retrying. Likely hardened feed rollers, a common fault
#     on old 7550As. Use manual feed until it is fixed.
#   - The pens are dry: lines are faint even at maximum force (FS 8).
#   - With HANDSHAKE NONE the plotter can't tell the PC to pause, so large
#     jobs will need pacing to avoid overflowing its 1024-byte input memory.
#   - Losing the plotter mid-run is not detected. If the plotter is switched
#     off after the run has started, the port stays open and the plotter
#     just stops answering: it looks like waiting for paper or a stuck step,
#     and the script won't reconnect. Stop it (Ctrl+C), fix the plotter,
#     clear it (CLEAR or power-cycle), and run again.
#       Tested:   switching the plotter off during the 60 s paper wait.
#       UNTESTED: unplugging the null-modem cable from the plotter while it
#                 stays on. Expected to behave the same; treat it as an
#                 unhandled edge case.

# ----------------------------------------------------------------------
# ARGUMENTS
# ----------------------------------------------------------------------
# param() must be the first statement in a PowerShell script (only
# comments may come before it). All arguments are optional.
param(
    [string]$Port = "COM3",     # serial port of the USB-serial adapter, default to COM3 if argument not given
    [ValidateRange(1, 8)]       # the carousel has 8 slots; reject anything else
    [int]$Pen = 1,              # carousel slot of the pen to draw with, default to 1 if argument not given
    [switch]$AppendLog          # keep earlier runs in the log (newest first); default is to rewrite it
)

# ----------------------------------------------------------------------
# CONFIGURATION
# ----------------------------------------------------------------------
# What is physically in each carousel slot right now. Only used to make the
# output readable; NEEDS TO BE UPDATED IF PENS ARE EVER CHANGED.
$PenNames = @{ 1 = "Rapidoplot fibre fine"; 2 = "Rapidoplot fibre fine"; 3 = "K-I-N fine" }
$PenName  = if ($PenNames.ContainsKey($Pen)) { $PenNames[$Pen] } else { "slot $Pen" }

# The two commands that depend on the chosen pen (see the command table
# below for what they mean).
$ForceCmd  = "FS8,$Pen;"
$SelectCmd = "SP$Pen;"

# Record everything this script prints to plotter-log.txt, next to the
# script.
#
# Default: REWRITE the log on every run. This was an explicit choice: we
# don't expect to need the output of previous runs, and a log holding only
# the last run is easier to read and share.
#
# With -AppendLog, earlier runs are kept with the newest run at the top.
# PowerShell's transcript can only add to the end of a file, so this run
# is recorded to a temporary file first and placed above the old log when
# the script finishes (see Close-Log). The whole run is wrapped in
# try/finally (see the bottom of this file), so the log is also closed
# and cleaned up when a run is stopped with Ctrl+C.
$LogFile = Join-Path $PSScriptRoot "plotter-log.txt"
if ($AppendLog) {
    $RunLog = Join-Path ([System.IO.Path]::GetTempPath()) "plotter-run-$PID.txt"
} else {
    $RunLog = $LogFile
}
Start-Transcript -Path $RunLog -Force | Out-Null

# Stop recording. With -AppendLog, put this run above the earlier ones.
function Close-Log {
    Stop-Transcript | Out-Null

    # The transcript header names the Windows user and computer. Remove
    # those lines so the log can be committed to the public repo.
    # (PowerShell 7 can skip them with -UseMinimalHeader, but Windows
    # PowerShell 5.1 can't.)
    $lines = Get-Content $RunLog | Where-Object { $_ -notmatch '^(Username|RunAs User|Machine):' }
    Set-Content -Path $RunLog -Value $lines -Encoding UTF8

    if ($AppendLog) {
        $thisRun = Get-Content -Raw $RunLog
        $earlier = if (Test-Path $LogFile) { Get-Content -Raw $LogFile } else { "" }
        Set-Content -Path $LogFile -Value ($thisRun + "`r`n" + $earlier) -NoNewline
        Remove-Item $RunLog
    }
}

# Everything from here to the end runs inside try/finally. The finally
# block at the bottom runs however the run ends: success, a STOPPED
# message, or Ctrl+C. That guarantees the port is closed and the
# username/computer name are removed from the log.
try {
    Write-Host "Plotter pen test: port $Port, pen $Pen ($PenName)"
    Write-Host ("Log mode: " + $(if ($AppendLog) { "append (newest run at top)" } else { "rewrite" }))

    # ----------------------------------------------------------------------
    # OPEN THE SERIAL PORT
    # ----------------------------------------------------------------------
    # These must match the plotter's front-panel settings (see the top of
    # this file): 9600 baud, no parity, 8 data bits, 1 stop bit.
    $serial = New-Object System.IO.Ports.SerialPort $Port, 9600, None, 8, One

    # No flow control. The plotter's HANDSHAKE is set to NONE, so it never
    # sends XON/XOFF. When XON/XOFF is On, the plotter only answered one question per run.
    $serial.Handshake = 'None'

    # Hold the DTR and RTS lines on, matching what `mode` shows on a working
    # setup. The plotter in DIRECT mode probably ignores them, but it is the
    # known-good state.
    $serial.DtrEnable = $true
    $serial.RtsEnable = $true

    # Default time to wait for an answer before giving up. Individual
    # questions can override it (see Ask below).
    $serial.ReadTimeout = 10000   # milliseconds

    # PowerShell wraps .NET errors in its own error type; this digs out the
    # original one so we can tell what actually went wrong.
    function Get-RootError($err) {
        $ex = $err.Exception
        while ($ex.InnerException) { $ex = $ex.InnerException }
        return $ex
    }

    # Opening fails if the port doesn't exist (wrong name, or the USB-serial
    # adapter is unplugged) or another program is already using it. Catch that
    # and explain, instead of letting PowerShell print a red error.
    try {
        $serial.Open()
    } catch {
        $why = (Get-RootError $_).Message
        $available = [System.IO.Ports.SerialPort]::GetPortNames() | Sort-Object
        $list = if ($available) { $available -join ", " } else { "none" }
        Write-Host ""
        Write-Host "STOPPED: couldn't open $Port."
        Write-Host "   Windows says: $why"
        Write-Host "   Serial ports on this computer right now: $list"
        Write-Host "   Check that:"
        Write-Host "     - the USB-serial adapter is plugged into the laptop"
        Write-Host "     - -Port matches the adapter's port (see 'Finding your port' at the top)"
        Write-Host "     - no other program (another PowerShell window, a terminal app) has the port open"
        exit 1
    }

    # Throw away anything already waiting on the PC side, for example a late
    # answer the plotter sent after a previous run had stopped listening.
    # Otherwise this run could read that stale answer as its own.
    $serial.DiscardInBuffer()

    # ----------------------------------------------------------------------
    # THE COMMANDS AND WHAT THEY MEAN
    # ----------------------------------------------------------------------
    # The plotter understands two kinds of commands:
    #
    #   HP-GL commands, two letters plus optional numbers, ending in ";"
    #   (e.g. "SP1;"). These go into the plotter's input memory and run in
    #   order. IMPORTANT: the plotter holds them, and answers no HP-GL
    #   question, until a sheet of paper is loaded.
    #
    #   Device-control commands, ESC + "." + one character (e.g. ESC.B),
    #   where ESC is ASCII character 27, the Escape character (the same code
    #   the Esc key sends). These control the serial interface itself and are
    #   answered immediately, even with no paper loaded, so they are useful
    #   for checking the plotter's state when HP-GL seems stuck.
    #
    # Commands starting with "O" (OI, OS, OA, OE, OT) are questions: the
    # plotter replies with text ending in a carriage return.
    #
    # Coordinates are in plotter units: 40 units = 1 mm, so 4000 = 10 cm.
    # (0,0) is the lower-left corner of the drawing area.
    $esc = [char]27   # ASCII character 27, Escape

    # Plain-language meaning of each command this script sends. Used both
    # for the output and as the step headings. Any command added to the
    # drawing below needs an entry here, or its line in the output is blank.
    $Meaning = @{
        # Device control
        "$esc.("         = "Plotter on: start listening to this computer"
        "$esc.B"         = "Status check: how much room is left in your input memory?"
        "$esc.O"         = "Status check: what state are you in right now?"
        "$esc.E"         = "Status check: have there been any communication errors?"
        # HP-GL questions
        "OI;"            = "Question: what model are you?"
        "OS;"            = "Question: what is your drawing status?"
        "OA;"            = "Question: where is the pen right now?"
        "OT;"            = "Question: what type of pen carousel is installed, and which slots hold pens?"
        "OE;"            = "Question: did the last command cause an error?"
        # HP-GL setup and drawing
        "IN;"            = "Reset all drawing settings to their defaults"
        "VS10;"          = "Slow the pen to 10 cm per second so old pens lay down more ink"
        $ForceCmd        = "Press pen $Pen down as hard as possible: force level 8 (paper pens default to about 2)"
        $SelectCmd       = "Pick up pen $Pen ($PenName) from the carousel"
        "PU1000,1000;"   = "Lift the pen and move to 2.5 cm right, 2.5 cm up from the corner"
        "PD5000,1000;"   = "Lower the pen and draw a 10 cm line to the right"
        "PD5000,5000;"   = "Keep the pen down and draw a 10 cm line upward"
        "PU;"            = "Lift the pen off the paper"
        "SP0;"           = "Put the pen back in the carousel"
        "PG;"            = "Advance the page: eject the finished sheet"
    }

    # ----------------------------------------------------------------------
    # WHAT THE PLOTTER'S ANSWERS MEAN
    # ----------------------------------------------------------------------
    # Turn OT's pen map into a list of slot numbers that hold a pen.
    # Each bit stands for one slot: bit 0 (value 1) = slot 1, bit 1 (value 2)
    # = slot 2, and so on up to slot 8.
    function Get-PenSlots($map) {
        1..8 | Where-Object { $map -band (1 -shl ($_ - 1)) }
    }

    # Turns a raw answer into plain language. Returns "" when there is
    # nothing useful to add; the raw answer is always printed anyway.
    function Explain($cmd, $reply) {
        # Answers to ESC.B/ESC.E/ESC.O/OS/OE should be plain numbers. If one
        # isn't, the answer probably belongs to a different question (the
        # script and plotter are out of step), so say so instead of guessing.
        $numeric = @("$esc.B", "$esc.E", "$esc.O", "OS;", "OE;")
        if (($numeric -contains $cmd) -and ($reply -notmatch '^\s*\d+\s*$')) {
            return "UNEXPECTED: this doesn't look like an answer to this question"
        }
        switch ($cmd) {
            # ESC.B: free bytes in the 1024-byte input memory. Anything less
            # than 1024 means commands are waiting to be processed.
            "$esc.B" { if ($reply -eq "1024") { return "input memory is empty (all 1024 bytes free)" }
                       return "$reply of 1024 bytes free; the rest are waiting to be processed" }

            # ESC.E: serial-interface errors (framing, overrun, ...). 0 = none.
            "$esc.E" { if ($reply -eq "0") { return "no communication errors" }
                       return "communication error code $reply" }

            # ESC.O: a number whose bits are flags. The 7550A manual says the
            # 8 flag means "input memory empty"; we have not confirmed what
            # the others mean, so they are listed as unknown.
            "$esc.O" { $n = [int]$reply; $parts = @()
                       if ($n -band 8) { $parts += "input memory empty" }
                       else            { $parts += "input memory NOT empty" }
                       $unknown = @(32, 16, 4, 2, 1) | Where-Object { $n -band $_ }
                       if ($unknown) { $parts += ("other flags " + ($unknown -join "+") + " (meaning not yet known)") }
                       return ($parts -join ", ") }

            # OI: the model name, e.g. "7550A".
            "OI;"    { return "the plotter identified itself" }

            # OS: standard HP-GL status flags, added together.
            "OS;"    { $n = [int]$reply; $parts = @()
                       if ($n -band 32) { $parts += "ERROR flagged" }
                       if ($n -band 16) { $parts += "ready for data" }
                       if ($n -band 8)  { $parts += "initialized" }
                       if ($n -band 2)  { $parts += "drawing area set" }
                       if ($n -band 1)  { $parts += "pen is down" }
                       return ($parts -join ", ") }

            # OA: "x,y,pen" in plotter units; pen is 1 when down, 0 when up.
            "OA;"    { $v = $reply -split ','
                       if ($v.Count -lt 3) { return "" }
                       $mmX = [math]::Round([double]$v[0] / 40, 1)
                       $mmY = [math]::Round([double]$v[1] / 40, 1)
                       $penState = if ($v[2].Trim() -eq "1") { "down" } else { "up" }
                       return "pen at $mmX mm right, $mmY mm up; pen $penState" }

            # OT: "type,map". type is a code for the carousel type (we have not
            # confirmed the code table). map is a number whose bits show which
            # slots hold a pen: bit 0 = slot 1, bit 1 = slot 2, ... so 7
            # (binary 111) means slots 1, 2 and 3.
            "OT;"    { $v = $reply -split ','
                       if ($v.Count -lt 2) { return "" }
                       $slots = Get-PenSlots ([int]$v[1])
                       $list = if ($slots) { $slots -join ", " } else { "none" }
                       return "carousel type $($v[0].Trim()); pens in slots: $list" }

            # OE: error code of the most recent HP-GL command. 0 = no error.
            "OE;"    { switch ($reply) {
                           "0" { return "no error" }
                           "1" { return "ERROR: command not recognized" }
                           "2" { return "ERROR: wrong number of values" }
                           "3" { return "ERROR: a value is out of range" }
                           default { return "ERROR: code $reply" } } }

            default  { return "" }
        }
    }

    # ----------------------------------------------------------------------
    # HELPERS FOR TALKING TO THE PLOTTER
    # ----------------------------------------------------------------------
    # ESC (ASCII 27) is invisible when printed, so show it as the text <ESC>.
    function Show($text) { $text -replace $esc, '<ESC>' }

    # Output layout: lines the computer sends start at the left margin ("->");
    # lines the plotter sends back are indented with a tab ("<-"). The command
    # column of sent lines is 22 characters wide so that, with a standard
    # 8-character tab, both kinds of line start their explanation in the same
    # column.
    #
    # Send one command and print it with its meaning. Does not wait for an
    # answer, so use it for commands that don't reply.
    function Send($cmd) {
        Write-Host ("-> {0,-22} {1}" -f (Show $cmd), $Meaning[$cmd])
        try {
            $serial.Write($cmd)
        } catch {
            # Writing only fails if the port itself has gone away, e.g. the
            # USB-serial adapter was unplugged during the run.
            ConnectionLost (Get-RootError $_).Message
        }
    }

    # Send a question and wait up to $waitSeconds for the answer.
    # Returns the answer, or $null if none arrived in time.
    # The plotter ends every answer with a carriage return (`r), so we read
    # up to that character.
    function Ask($cmd, $waitSeconds) {
        Send $cmd
        $oldTimeout = $serial.ReadTimeout
        $serial.ReadTimeout = $waitSeconds * 1000
        $reply = $null
        try {
            $reply = $serial.ReadTo("`r")
        } catch {
            $ex = Get-RootError $_
            # A TimeoutException just means nothing arrived in time. Anything
            # else means the port itself has gone away.
            if ($ex -is [System.TimeoutException]) {
                Write-Host "`t<- (no answer within $waitSeconds s)"
            } else {
                ConnectionLost $ex.Message
            }
        }
        # Explain the answer outside the try above, so a surprising answer can
        # never be mistaken for a lost connection.
        if ($null -ne $reply) {
            Write-Host ("`t<- {0,-14} {1}" -f $reply, (Explain $cmd $reply))
        }
        $serial.ReadTimeout = $oldTimeout
        return $reply
    }

    # Ask the three device-control questions. These are answered even when
    # HP-GL is stuck, so this is what we print when something goes wrong.
    function StatusChecks {
        Write-Host ""
        Write-Host "   Checking the plotter's internal state:"
        Ask "$esc.B" 3 | Out-Null
        Ask "$esc.O" 3 | Out-Null
        Ask "$esc.E" 3 | Out-Null
    }

    # End the script with the given code (0 = success, 1 = failure). The
    # finally block at the bottom of this file closes the port and the log.
    function Finish($exitCode) {
        exit $exitCode
    }

    # Called when the port disappears in the middle of a run.
    function ConnectionLost($why) {
        Write-Host ""
        Write-Host "STOPPED: lost the connection to $Port."
        Write-Host "   Windows says: $why"
        Write-Host "   Was the USB-serial adapter unplugged? Plug it back in and run again."
        Finish 1
    }

    # ----------------------------------------------------------------------
    # STEP 1: SETUP. Turn the plotter on, reset it, and wait for a sheet.
    # ----------------------------------------------------------------------
    Write-Host "== Setup: turn the plotter on, reset it, and check it answers"
    Send "$esc.("
    Start-Sleep -Milliseconds 500     # give the interface a moment to switch on

    # Connection check. The port can open fine with nothing on the other end:
    # the plotter switched off, the null-modem cable unplugged, or the wrong
    # port. A device-control question is answered even with no paper loaded,
    # so silence here means nothing is listening.
    $alive = Ask "$esc.B" 3
    if ($null -eq $alive) {
        Write-Host ""
        Write-Host "STOPPED: $Port opened, but the plotter isn't answering."
        Write-Host "   Check that:"
        Write-Host "     - the plotter is switched on"
        Write-Host "     - the null-modem cable is connected at both ends (adapter, and the"
        Write-Host "       plotter's COMPUTER/MODEM port, not TERMINAL)"
        Write-Host "     - -Port is the adapter the plotter is cabled to"
        Write-Host "     - the plotter's serial settings match SETTINGS THAT WORK at the top"
        Finish 1
    }

    # Leftover-commands check. A run that was stopped early (Ctrl+C, adapter
    # unplugged, plotter waiting for paper) can leave commands queued in the
    # plotter. They run as soon as a sheet is loaded, and their answers get
    # mixed up with this run's, so the plotter can show "10: INVALID I/O
    # OUTPUT REQUEST" and the script reads the wrong answers. At the start of
    # a clean run the input memory is empty (all 1024 bytes free).
    if (($alive -notmatch '^\s*\d+\s*$') -or ([int]$alive -lt 1024)) {
        Write-Host ""
        Write-Host "STOPPED: the plotter still has commands left over from an earlier run"
        Write-Host "   (free input memory: $alive of 1024). Clear them first, then run again:"
        Write-Host "     - press CLEAR on the plotter's front panel and confirm, or"
        Write-Host "     - switch the plotter off and on."
        Finish 1
    }

    Send "IN;"

    # Asking for the model doubles as a paper check: the plotter answers no
    # HP-GL question until a sheet is loaded.
    $id = Ask "OI;" 10
    if ($null -eq $id) {
        # The question is still queued in the plotter, so its answer will
        # arrive by itself as soon as a sheet is loaded. Wait for it rather
        # than asking again.
        Write-Host ""
        Write-Host "   No sheet in the plotter yet."
        Write-Host "   Put a sheet in the single-sheet feeder and press LOAD/UNLOAD now."
        Write-Host "   Waiting up to 60 s..."
        $serial.ReadTimeout = 60000
        try {
            $id = $serial.ReadTo("`r")
            Write-Host ("`t<- {0,-14} {1}" -f $id, (Explain "OI;" $id))
        } catch {
            $ex = Get-RootError $_
            if ($ex -is [System.TimeoutException]) { $id = $null }
            else { ConnectionLost $ex.Message }
        }
        $serial.ReadTimeout = 10000
    }
    if ($null -eq $id) {
        Write-Host "STOPPED: the plotter didn't identify itself, so nothing else will work."
        Write-Host "Most likely no sheet got loaded. Check that:"
        Write-Host "  - you pressed LOAD/UNLOAD on the plotter"
        Write-Host "  - AUTO FEED is OFF (no asterisk under the AUTO FEED key); auto feed"
        Write-Host "    is currently broken, see KNOWN ISSUES at the top of this script"
        Write-Host "  - the display doesn't say PAPER LOAD FAILED"
        StatusChecks
        Finish 1
    }

    # A few questions to record the plotter's starting state in the log.
    Ask "OS;" 10 | Out-Null
    Ask "OA;" 10 | Out-Null
    $carousel = Ask "OT;" 10

    # Empty-slot check. The plotter senses which slots hold pens; stop now
    # rather than "drawing" with an empty slot, which would look like a normal
    # run but put nothing on the paper.
    $fields = if ($carousel) { $carousel -split ',' } else { @() }
    if ($fields.Count -ge 2) {
        $filled = Get-PenSlots ([int]$fields[1])
        if ($filled -notcontains $Pen) {
            $list = if ($filled) { $filled -join ", " } else { "none" }
            Write-Host ""
            Write-Host "STOPPED: slot $Pen has no pen in it (the plotter reports pens in slots: $list)."
            Write-Host "Put a pen in slot $Pen, or run again with -Pen set to a filled slot."
            Finish 1
        }
    } else {
        Write-Host ""
        Write-Host "WARNING: couldn't read which slots hold pens, so the script can't"
        Write-Host "check slot $Pen. Make sure by eye that it has a pen in it."
    }

    # ----------------------------------------------------------------------
    # STEP 2: DRAW, one command at a time.
    # ----------------------------------------------------------------------
    # Speed and force first (they apply when the pen is picked up), then the
    # drawing, then put the pen away and eject the sheet. The result is an
    # L-shape: 10 cm along the bottom, then 10 cm up the right side.
    $steps = @(
        "VS10;",          # slow down
        $ForceCmd,        # press harder
        $SelectCmd,       # pick up the chosen pen
        "PU1000,1000;",   # move to the start point, pen up
        "PD5000,1000;",   # draw right
        "PD5000,5000;",   # draw up
        "PU;",            # lift the pen
        "SP0;",           # put the pen back
        "PG;"             # eject the sheet
    )

    $n = 0
    foreach ($cmd in $steps) {
        $n++
        Write-Host ""
        Write-Host ("== Step {0} of {1}: {2}" -f $n, $steps.Count, $Meaning[$cmd])
        Send $cmd

        if ($cmd -eq "PG;") {
            # After the sheet is ejected the plotter holds every HP-GL command,
            # including the error check, until a new sheet is loaded. Asking
            # would just time out, so report what should have happened instead.
            Write-Host "   The finished sheet should now be ejected."
            continue
        }

        # The plotter runs commands in order, so it answers OE only after it
        # has finished the command above. No answer within 15 s means it is
        # still busy with that command or stuck on it.
        $err = Ask "OE;" 15
        if ($null -eq $err) {
            Write-Host "STUCK at step ${n}: the plotter never finished '$cmd' ($($Meaning[$cmd]))."
            Write-Host "Check the plotter's display and whether the pen moved."
            StatusChecks
            Finish 1
        }

        # Where the pen ended up, to confirm the step did what we expected.
        Ask "OA;" 10 | Out-Null
    }

    Write-Host ""
    Write-Host "== Done"
    Finish 0
} finally {
    # $serial is empty if the script stopped before creating it. Closing
    # can fail if the adapter was unplugged; nothing to do about it.
    if ($serial) { try { $serial.Close() } catch { } }
    Close-Log
}
