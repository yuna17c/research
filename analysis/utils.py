from retrieve import get_key
from firebase_admin import firestore

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
            accept_lst = []
            final_lst = []
            # each log event
            for logEvent in logs[key]:
                if logEvent['eventName']=='suggestion-generate':
                    suggestion_lst.append(logEvent['textDelta'])
                elif logEvent['eventName']=='suggestion-accept':
                    accept_lst.append(suggestion_lst[-1])

            for accepted in accept_lst:
                for word in accepted.split():
                    if word in full_text[key]:
                        final_lst.append(word)

            # lengths
            total_l = sum([len(i) for i in suggestion_lst])
            final_l = sum([len(i) for i in final_lst])
            lengths[doc.id][key] = [final_l, total_l]
            percents[doc.id][key] = round(final_l/total_l, 4)
        
    return percents, lengths
