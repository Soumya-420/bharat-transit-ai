import re

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-worker.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# Replace block 1: The title and lang bar
replacements = {
    '<title>????? ??????????  ????? ???</title>': '<title data-i18n="worker_dash_title">কর্মী ড্যাশবোর্ড - কাজের লোক</title>',
    '<span class="lang-msg" id="langMsg">?? ???? ???????? ???? / Select Language / ???? ?????</span>': '<span class="lang-msg" id="langMsg" data-i18n="lang_selection_title">🌐 ভাষা নির্বাচন করুন / Select Language / भाषा चुनें</span>',
    '<div><span class="sl-text">নাম নেই</span><span class="sl-sub">নাম নেই</span></div>': '<div><span class="sl-text" data-i18n="nav_brand">কাজের লোক</span><span class="sl-sub" data-i18n="worker_sidebar_sub">কর্মী পোর্টাল</span></div>',
    '<span class="nav-section-title">নাম নেই</span>': '<span class="nav-section-title" data-i18n="nav_section_dash">ড্যাশবোর্ড</span>',
    '<button class="nav-item active" data-page="pw-home"><span class="nav-icon"></span><span\n                        class="nav-label"></span></button>': '<button class="nav-item active" data-page="pw-home"><span class="nav-icon"></span><span class="nav-label" data-i18n="nav_overview">ওভারভিউ</span></button>',
    '<button class="nav-item" data-page="pw-jobs"><span class="nav-icon"></span><span\n                        class="nav-label">নাম নেই</span></button>': '<button class="nav-item" data-page="pw-jobs"><span class="nav-icon"></span><span class="nav-label" data-i18n="nav_my_jobs">আমার কাজসমূহ</span></button>',
    '<button class="nav-item" data-page="pw-earnings"><span class="nav-icon"></span><span\n                        class="nav-label">??? ? ???????</span></button>': '<button class="nav-item" data-page="pw-earnings"><span class="nav-icon"></span><span class="nav-label" data-i18n="nav_earnings">আয় ও পেমেন্ট</span></button>',
    '<button class="nav-item" data-page="pw-profile"><span class="nav-icon"></span><span\n                        class="nav-label">নাম নেই</span></button>': '<button class="nav-item" data-page="pw-profile"><span class="nav-icon"></span><span class="nav-label" data-i18n="nav_my_profile">আমার প্রোফাইল</span></button>',
    '<span class="nav-section-title"></span>': '<span class="nav-section-title" data-i18n="nav_section_settings">সেটিংস</span>',
    '<button class="nav-item" data-page="pw-update"><span class="nav-icon"></span><span\n                        class="nav-label">???????? ????? ??????</span></button>': '<button class="nav-item" data-page="pw-update"><span class="nav-icon"></span><span class="nav-label" data-i18n="nav_update_status">অ্যাভেইল্যাবিলিটি আপডেট</span></button>',
    '<button class="nav-item" data-page="pw-schedule"><span class="nav-icon"></span><span\n                        class="nav-label"></span></button>': '<button class="nav-item" data-page="pw-schedule"><span class="nav-icon"></span><span class="nav-label" data-i18n="nav_schedule">কাজের সময়সূচী</span></button>',
    '<div class="su-name" id="wSideName">??? ?????...</div>': '<div class="su-name" id="wSideName">লোড হচ্ছে...</div>',
    '<strong style="font-size:14px">নাম নেই</strong>': '<strong style="font-size:14px" data-i18n="notif_title">নোটিফিকেশন</strong>',
    '<button onclick="markAllRead();renderWorkerNotifs()"\n                        style="font-size:12px;color:var(--primary);background:none;border:none;cursor:pointer">?? ???\n                        ???</button>': '<button onclick="markAllRead();renderWorkerNotifs()" style="font-size:12px;color:var(--primary);background:none;border:none;cursor:pointer" data-i18n="btn_mark_all_read">সব পড়া হয়েছে</button>',
    '<span>?? ????? ????? ????</span>': '<span data-i18n="label_monthly_limit">এই মাসের কাজের সীমা</span>',
    '<span id="limitText">?? / ?? ??? ???????</span>': '<span id="limitText">০ / ৩০ দিন বুকিং</span>',
    '<p style="font-size:12px;color:var(--text-muted);margin-top:6px">?? ??? ????? ??? ???????\n                            ?????????? ???? ???? ?????? ???? ??? ????? ???</p>': '<p style="font-size:12px;color:var(--text-muted);margin-top:6px" data-i18n="desc_monthly_limit">আপনি প্রতি মাসে সর্বোচ্চ ৩০ দিন কাজ করতে পারেন। অতিরিক্ত কাজের জন্য ওভারটাইম ফি প্রযোজ্য হতে পারে।</p>',
    '<div class="sc-label">নাম নেই</div>': '<div class="sc-label" data-i18n="stat_active_jobs_title">চলমান কাজ</div>',
    '<div class="sc-label">নাম নেই</div>': '<div class="sc-label" data-i18n="stat_completed_jobs">সম্পন্ন কাজ</div>',
    '<div class="sc-value">??,???</div>': '<div class="sc-value">৳০</div>',
    '<div class="sc-label">?? ????? ???</div>': '<div class="sc-label" data-i18n="stat_earnings_this_month">এই মাসের আয়</div>',
    '<div class="sc-value">?.?</div>': '<div class="sc-value">০.০</div>',
    '<div class="sc-label">নাম নেই</div>': '<div class="sc-label" data-i18n="stat_avg_rating">গড় রেটিং</div>',
    '<div class="card-header"><span class="card-title">?? ???? ????? ??????</span></div>': '<div class="card-header"><span class="card-title" data-i18n="card_pending_jobs">নতুন কাজের প্রস্তাব</span></div>',
    '<div style="font-weight:700;color:var(--text)">নাম নেই</div>': '<div style="font-weight:700;color:var(--text)">গ্রাহকের নাম</div>',
    '<div style="font-size:13px;color:var(--text-muted)">????????? | ??????? ??????? |\n                                        ????? ????</div>': '<div style="font-size:13px;color:var(--text-muted)">পরিষেবা | সময়কাল | শুরু হবে</div>',
    '<div style="font-size:13px;color:var(--accent);margin-top:4px">??,???/???</div>': '<div style="font-size:13px;color:var(--accent);margin-top:4px">৳০/মাস</div>',
    '<button class="btn btn-success btn-sm" onclick="acceptJob(this)">নাম নেই</button>': '<button class="btn btn-success btn-sm" onclick="acceptJob(this)" data-i18n="btn_accept">গ্রহণ করুন</button>',
    '<button class="btn btn-danger btn-sm" onclick="declineJob(this)">নাম নেই</button>': '<button class="btn btn-danger btn-sm" onclick="declineJob(this)" data-i18n="btn_decline">প্রত্যাখ্যান</button>',
    '<div class="card-header"><span class="card-title">?? ??????? ???</span></div>': '<div class="card-header"><span class="card-title" data-i18n="card_active_jobs">আমার বর্তমান কাজ</span></div>',
    '<th></th>': '<th></th>', 
    '<td><strong>নাম নেই</strong></td>': '<td><strong>গ্রাহকের নাম</strong></td>',
    '<td>??/??/??</td>': '<td>০০/০০/০০</td>',
    '<td>??,???</td>': '<td>৳০</td>',
    '<td>???/???</td>': '<td>৳০/মাস</td>',
    '<div class="card-header"><span class="card-title">?? ?? ????? ??????</span></div>': '<div class="card-header"><span class="card-title" data-i18n="card_all_jobs">আমার সব কাজের তালিকা</span></div>',
    '<button class="admin-tab active" onclick="filterJobs(\'all\',this)"></button>': '<button class="admin-tab active" onclick="filterJobs(\'all\',this)" data-i18n="tab_all">সব</button>',
    '<button class="admin-tab" onclick="filterJobs(\'active\',this)"></button>': '<button class="admin-tab" onclick="filterJobs(\'active\',this)" data-i18n="tab_active">সক্রিয়</button>',
    '<button class="admin-tab" onclick="filterJobs(\'completed\',this)"></button>': '<button class="admin-tab" onclick="filterJobs(\'completed\',this)" data-i18n="tab_completed">সম্পন্ন</button>'
}

for k, v in replacements.items():
    html = html.replace(k, v)

# Fix empty table headers
html = html.replace('<th></th>\n                                        <th></th>\n                                        <th></th>\n                                        <th></th>\n                                        <th></th>', 
                    '<th data-i18n="table_customer">গ্রাহক</th>\n                                        <th data-i18n="table_plan">প্ল্যান</th>\n                                        <th data-i18n="table_date">তারিখ</th>\n                                        <th data-i18n="table_amount">পরিমাণ</th>\n                                        <th data-i18n="table_status">অবস্থা</th>')

html = html.replace('<th></th>\n                                        <th></th>\n                                        <th></th>\n                                        <th></th>\n                                        <th></th>\n                                        <th></th>\n                                        <th></th>', 
              '<th data-i18n="table_job_id">জব আইডি</th>\n                                        <th data-i18n="table_customer">গ্রাহক</th>\n                                        <th data-i18n="table_service">সেবা</th>\n                                        <th data-i18n="table_plan">প্ল্যান</th>\n                                        <th data-i18n="table_date">তারিখ</th>\n                                        <th data-i18n="table_status">অবস্থা</th>\n                                        <th data-i18n="table_rating">রেটিং</th>')

# More localized fixes based on regex with properly escaped question marks
html = re.sub(r'>\?{8} \?{3}<', '>অ্যাভেইল্যাবিলিটি অবস্থা<', html)

# Replace exact patterns that are badly corrupted
html = html.replace('<div class="sc-label" data-i18n="stat_completed_jobs">সম্পন্ন কাজ</div>\n                        </div>\n                        <div class="stat-card">\n                            <div class="sc-icon"></div>\n                            <div class="sc-value">৳০</div>\n                            <div class="sc-label" data-i18n="stat_earnings_this_month">এই মাসের আয়</div>\n                        </div>\n                        <div class="stat-card">\n                            <div class="sc-icon"></div>\n                            <div class="sc-value">০.০</div>\n                            <div class="sc-label" data-i18n="stat_avg_rating">গড় রেটিং</div>\n                        </div>',
                     '<div class="sc-label" data-i18n="stat_completed_jobs">সম্পন্ন কাজ</div>\n                        </div>\n                        <div class="stat-card">\n                            <div class="sc-icon"></div>\n                            <div class="sc-value" id="statEarnings">৩,২০০</div><br>\n                            <div class="sc-label" data-i18n="stat_earnings_this_month">এই মাসের আয়</div>\n                        </div>\n                        <div class="stat-card">\n                            <div class="sc-icon"></div>\n                            <div class="sc-value" id="statRating">৪.৮</div><br>\n                            <div class="sc-label" data-i18n="stat_avg_rating">গড় রেটিং</div>\n                        </div>')

# Scrape through and replace all lone ? clusters with standard placeholder text (e.g. '-' or '০') if inside a value container
html = re.sub(r'>\?{2}<', '>০০<', html)
html = re.sub(r'>\?,\?{3}<', '>০,০০০<', html)
html = re.sub(r'>\?{3}\/\?{3}<', '>০০/০০<', html)

# Just run a general clean
html = re.sub(r'>\s*\?+\s*<', '><', html)

with open(filepath, 'w', encoding='utf8') as f:
    f.write(html)
    
print("Successfully processed dashboard-worker.html")
