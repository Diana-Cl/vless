# ═══════════════════════════════════════════════════════════════
#  WEBSITE CONNECTIVITY TESTER
#  Real HTTP/HTTPS Connection Testing - No DNS Tricks!
# ═══════════════════════════════════════════════════════════════
#
# Usage:
#   irm https://raw.githubusercontent.com/NiREvil/vless/main/edge/connectivity-test.ps1 | iex
#
# Commands:
#   test              # Test all websites
#   test -Quick       # Test only essential sites (faster)
#   test -Verbose     # Show detailed response info
#
# ═══════════════════════════════════════════════════════════════

function Show-Banner {
    Write-Host "`n" -NoNewline
    Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║" -ForegroundColor Cyan -NoNewline
    Write-Host "       REAL CONNECTIVITY TEST - NO DNS GAMES       " -ForegroundColor White -NoNewline
    Write-Host "║" -ForegroundColor Cyan
    Write-Host "║" -ForegroundColor Cyan -NoNewline
    Write-Host "        Testing Actual HTTP/HTTPS Connections      " -ForegroundColor Yellow -NoNewline
    Write-Host "║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Progress {
    param([int]$Current, [int]$Total)
    $percent = [math]::Round(($Current / $Total) * 100)
    $barLength = 40
    $filled = [math]::Round(($percent / 100) * $barLength)
    $bar = "█" * $filled + "░" * ($barLength - $filled)
    
    Write-Host "`r  Progress: [" -NoNewline -ForegroundColor Gray
    Write-Host $bar -NoNewline -ForegroundColor Cyan
    Write-Host "] $percent% ($Current/$Total)" -NoNewline -ForegroundColor Gray
}

function Test-WebsiteConnectivity {
    param (
        [Parameter(Mandatory = $false)]
        [switch]$Quick,
        
        [Parameter(Mandatory = $false)]
        [switch]$Verbose
    )

    # Full list of important websites
    $allSites = @(
        @{ Name = "Google"; URL = "https://www.google.com"; Essential = $true },
        @{ Name = "YouTube"; URL = "https://www.youtube.com"; Essential = $true },
        @{ Name = "Instagram"; URL = "https://www.instagram.com"; Essential = $true },
        @{ Name = "X (Twitter)"; URL = "https://x.com"; Essential = $true },
        @{ Name = "Reddit"; URL = "https://www.reddit.com"; Essential = $true },
        @{ Name = "Telegram"; URL = "https://telegram.org"; Essential = $true },
        @{ Name = "OpenAI"; URL = "https://chat.openai.com"; Essential = $true },
        @{ Name = "Gemini"; URL = "https://gemini.google.com"; Essential = $true },
        @{ Name = "Cloudflare"; URL = "https://www.cloudflare.com"; Essential = $false },
        @{ Name = "GitHub"; URL = "https://github.com"; Essential = $false },
        @{ Name = "GitHubRaw"; URL = "https://raw.githubusercontent.com"; Essential = $false },
        @{ Name = "Discord"; URL = "https://discord.com"; Essential = $false },
        @{ Name = "WhatsApp"; URL = "https://web.whatsapp.com"; Essential = $false },
        @{ Name = "TikTok"; URL = "https://www.tiktok.com"; Essential = $false }
    )

    # Filter sites based on Quick mode
    $sites = if ($Quick) {
        $allSites | Where-Object { $_.Essential -eq $true }
    } else {
        $allSites
    }

    Show-Banner
    
    Write-Host "  Mode: " -NoNewline -ForegroundColor Gray
    if ($Quick) {
        Write-Host "Quick Test (Essential Sites Only)" -ForegroundColor Yellow
    } else {
        Write-Host "Full Test (All Sites)" -ForegroundColor Green
    }
    
    Write-Host "  Testing " -NoNewline -ForegroundColor Gray
    Write-Host "$($sites.Count)" -NoNewline -ForegroundColor Yellow
    Write-Host " websites with real HTTP requests..." -ForegroundColor Gray
    Write-Host "`n" + ("─" * 55) -ForegroundColor DarkGray

    $results = @()
    $successCount = 0
    $blockedCount = 0
    $timeoutCount = 0
    $totalTime = 0
    $counter = 0

    foreach ($site in $sites) {
        $counter++
        Show-Progress -Current $counter -Total $sites.Count
        
        $start = Get-Date
        try {
            $response = Invoke-WebRequest -Uri $site.URL -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
            $end = Get-Date
            $ms = ($end - $start).TotalMilliseconds
            
            $results += [PSCustomObject]@{
                Name = $site.Name
                URL = $site.URL
                Status = "ACCESSIBLE"
                StatusCode = $response.StatusCode
                Time = $ms
                Details = "OK"
            }
            
            $successCount++
            $totalTime += $ms
        }
        catch {
            $end = Get-Date
            $ms = ($end - $start).TotalMilliseconds
            
            $statusCode = "N/A"
            $status = "BLOCKED"
            $details = "Connection Failed"
            
            if ($_.Exception.Response) {
                $statusCode = [int]$_.Exception.Response.StatusCode
                if ($statusCode -eq 403 -or $statusCode -eq 451) {
                    $status = "FILTERED"
                    $details = "Blocked by Firewall"
                } elseif ($statusCode -ge 400 -and $statusCode -lt 500) {
                    $status = "CLIENT_ERROR"
                    $details = "HTTP $statusCode"
                } elseif ($statusCode -ge 500) {
                    $status = "SERVER_ERROR"
                    $details = "Server Issue"
                }
            } elseif ($_.Exception.Message -match "timeout") {
                $status = "TIMEOUT"
                $details = "Connection Timeout"
                $timeoutCount++
            } else {
                $status = "BLOCKED"
                $details = "Network Blocked"
                $blockedCount++
            }
            
            $results += [PSCustomObject]@{
                Name = $site.Name
                URL = $site.URL
                Status = $status
                StatusCode = $statusCode
                Time = $ms
                Details = $details
            }
            
            if ($status -eq "FILTERED" -or $status -eq "BLOCKED") {
                $blockedCount++
            }
        }
    }

    # Display results with beautiful formatting
    Write-Host "`n`n" + ("─" * 55) -ForegroundColor DarkGray
    Write-Host "`n  RESULTS:" -ForegroundColor Cyan
    Write-Host ""

    foreach ($r in $results) {
        $statusColor = switch ($r.Status) {
            "ACCESSIBLE" { "Green" }
            "FILTERED" { "Red" }
            "BLOCKED" { "Red" }
            "TIMEOUT" { "Yellow" }
            default { "Magenta" }
        }
        
        $statusSymbol = if ($r.Status -eq "ACCESSIBLE") { "✓" } else { "✗" }
        $timeColor = if ($r.Time -lt 500) { "Green" } elseif ($r.Time -lt 2000) { "Yellow" } else { "Red" }
        
        Write-Host "  $statusSymbol " -NoNewline -ForegroundColor $statusColor
        Write-Host ("{0,-20}" -f $r.Name) -NoNewline -ForegroundColor White
        Write-Host (" {0,6} ms  " -f [math]::Round($r.Time)) -NoNewline -ForegroundColor $timeColor
        Write-Host ("[" -NoNewline -ForegroundColor DarkGray
        Write-Host $r.Status -NoNewline -ForegroundColor $statusColor
        Write-Host "]" -ForegroundColor DarkGray
        
        if ($Verbose -or $r.Status -ne "ACCESSIBLE") {
            Write-Host ("    └─ " + $r.Details) -ForegroundColor DarkGray
            if ($r.StatusCode -ne "N/A") {
                Write-Host ("       HTTP " + $r.StatusCode) -ForegroundColor DarkGray
            }
        }
    }

    # Summary
    Write-Host "`n" + ("─" * 55) -ForegroundColor DarkGray
    Write-Host "`n  SUMMARY:" -ForegroundColor Cyan
    Write-Host ""
    
    $successRate = [math]::Round(($successCount / $sites.Count) * 100, 1)
    $avgTime = if ($successCount -gt 0) { [math]::Round($totalTime / $successCount, 1) } else { 0 }
    
    Write-Host "  • Accessible:    " -NoNewline -ForegroundColor Gray
    Write-Host "$successCount" -NoNewline -ForegroundColor Green
    Write-Host " / $($sites.Count)" -ForegroundColor DarkGray
    
    Write-Host "  • Blocked:       " -NoNewline -ForegroundColor Gray
    Write-Host "$blockedCount" -ForegroundColor $(if ($blockedCount -eq 0) { "Green" } else { "Red" })
    
    Write-Host "  • Timeout:       " -NoNewline -ForegroundColor Gray
    Write-Host "$timeoutCount" -ForegroundColor $(if ($timeoutCount -eq 0) { "Green" } else { "Yellow" })
    
    Write-Host "  • Success Rate:  " -NoNewline -ForegroundColor Gray
    $rateColor = if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 50) { "Yellow" } else { "Red" }
    Write-Host "$successRate%" -ForegroundColor $rateColor
    
    Write-Host "  • Average Speed: " -NoNewline -ForegroundColor Gray
    $speedColor = if ($avgTime -lt 1000) { "Green" } elseif ($avgTime -lt 3000) { "Yellow" } else { "Red" }
    Write-Host "$avgTime ms" -ForegroundColor $speedColor

    # Overall verdict
    Write-Host "`n  VERDICT: " -NoNewline -ForegroundColor Cyan
    if ($successRate -eq 100) {
        Write-Host "Perfect! All websites are accessible." -ForegroundColor Green
    }
    elseif ($successRate -ge 80) {
        Write-Host "Good! Most sites work, minor filtering detected." -ForegroundColor Yellow
    }
    elseif ($successRate -ge 50) {
        Write-Host "Moderate filtering. VPN recommended." -ForegroundColor Yellow
    }
    elseif ($successRate -ge 20) {
        Write-Host "Heavy filtering! VPN/Proxy required." -ForegroundColor Red
    }
    else {
        Write-Host "Critical! Internet severely restricted." -ForegroundColor Red
    }

    Write-Host "`n" + ("═" * 55) -ForegroundColor Cyan
    Write-Host ""
}

# Set aliases
Set-Alias -Name test -Value Test-WebsiteConnectivity -Scope Global

# Quick start guide
Write-Host "`n  Quick Start:" -ForegroundColor Cyan
Write-Host "  ────────────" -ForegroundColor DarkGray
Write-Host "    test                     " -NoNewline -ForegroundColor Yellow
Write-Host "# Test all websites" -ForegroundColor Gray
Write-Host "    test -Quick              " -NoNewline -ForegroundColor Yellow
Write-Host "# Test essential sites only (faster)" -ForegroundColor Gray
Write-Host "    test -Verbose            " -NoNewline -ForegroundColor Yellow
Write-Host "# Show detailed information" -ForegroundColor Gray
Write-Host ""
Write-Host "  This tests REAL connections, not just DNS!" -ForegroundColor Green
Write-Host ""
