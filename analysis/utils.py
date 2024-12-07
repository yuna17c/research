from retrieve import get_key
from firebase_admin import firestore

def process_text(txt):
    return "".join([c for c in txt if c not in ".,?;:!()"])

# return two dictionaries: lengths and percents
# lengths is a dictionary of a list: [length of accepted suggestions, length of total suggestions]
# percents is a dictionary of length of accepted suggestions/length of total suggestions
def calculate_accepted_suggestions():
    db = firestore.client()
    docs = db.collection('user-input').stream()
    lengths = {}
    percents = {}
    # loop through each document
    for doc in docs:
        # for now; remove it as necessary
        if doc.id!='55cff4a834e9060012e57407':
            continue
        content = doc.to_dict()
        logs = content['logs']
        full_text = content['aiWritingText']
        keys = get_key(content['option'], list(logs.keys()))
        # each positive and negative log
        lengths[doc.id] = {}
        percents[doc.id] = {}
        for key in keys:
            start_time = logs[key][0]['eventTimestamp']
            end_time = logs[key][-1]['eventTimestamp']
            suggestion_lst = []
            suggestion_dic = {}
            accept_lst = []
            final_lst = []
            # each log event
            for logEvent in logs[key]:
                evtName = logEvent['eventName']
                if evtName=='suggestion-generate' or evtName=='suggestion-regenerate':
                    suggestion_lst.append(process_text(logEvent['textDelta']))
                elif evtName=='suggestion-accept':
                    accept_lst.append(suggestion_lst[-1])
            
            for accepted in accept_lst:
                word_list = accepted.split()
                found = [False] * len(word_list)
                first_word = process_text(word_list[0])
                processed_full = process_text(full_text[key])
                if first_word in processed_full:
                    found[0] = True
                for i in range(len(word_list)):
                    word = " ".join(word_list[i:min(len(word_list),i+2)])
                    processed = process_text(word)
                    if processed in processed_full:
                        found[i] = True
                    if found[i] or found[i-1]:
                        final_lst.append(word.split(" ")[0])

            # lengths
            print(suggestion_lst)
            print(accept_lst)
            print(final_lst)
            total_l = sum([len(i) for i in suggestion_lst])
            final_l = sum([len(i) for i in final_lst])
            lengths[doc.id][key] = [final_l, total_l]
            percents[doc.id][key] = round(final_l/total_l, 4)
        
    return percents, lengths

def calculate_edits():
    db = firestore.client()
    docs = db.collection('user-input').stream()
    df = {}
    # loop through each document
    for doc in docs:
        # for now; remove it as necessary
        if doc.id!='55cff4a834e9060012e57407':
            continue
        content = doc.to_dict()
        logs = content['logs']
        full_text = content['aiWritingText']
        keys = get_key(content['option'], list(logs.keys()))
        # each positive and negative log
        df[doc.id] = {}
        for key in keys:
            suggestion_lst = []
            accept_lst = []
            # each log event
            for logEvent in logs[key]:
                evtName = logEvent['eventName']
                if evtName=='suggestion-generate' or evtName=='suggestion-regenerate':
                    suggestion_lst.append(process_text(logEvent['textDelta']))
                elif evtName=='suggestion-accept':
                    accept_lst.append(suggestion_lst[-1])
            
            edited_cnt, total = 0, len(accept_lst)
            for accepted in accept_lst:
                if accepted not in full_text[key]:
                    edited_cnt+=1
            edited_percentage = round(edited_cnt/total, 2) 
        
            df[doc.id][key+"-edited"] = edited_cnt
            df[doc.id][key+"-total"] = total
            df[doc.id][key] = edited_percentage
        # print(df)
    return df