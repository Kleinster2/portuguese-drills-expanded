# Fresh Test - New Portuguese Content

Let's test the annotation system with completely new text!

## Test Case 1: Maria's Introduction

**Step 1: Standard Portuguese**
```
Eu sou a Maria.
Eu sou portuguesa de Lisboa.
Eu moro no Porto com meu irmão.
Eu trabalho em um hospital.
Eu falo português e espanhol.
Eu gosto de café e de futebol.
Eu vou de ônibus para o trabalho.
Eu tenho dois gatos e um cachorro.
Eu estou em casa agora.
Eu estou contente de estudar inglês.
```

**Step 4: With Reductions**
```
_Sô_ a Maria.
_Sô_ portuguesa de Lisboa.
Moro no Porto com meu irmão.
Trabalho em um hospital.
Falo português e espanhol.
Gosto de café e de futebol.
_Vô_ de ônibus _pro_ trabalho.
Tenho dois gatos e um cachorro.
_Tô_ em casa agora.
_Tô_ contente de _estudá_ inglês.
```

**Step 5: Full Colloquial**
```
_Sô_ Maria.
_Sô_ portuguesa _dji_ Lisboa.
Moro _no_ Porto com meu irmão.
Trabalho _num_ hospital.
Falo português e espanhol.
_Gostchi_ café e _dji_ futebol.
_Vô_ _djônibus_ _pro_ trabalho.
_Tenhu_ dois gatos e um cachorro.
_Tô_ _ncasa_ agora.
_Tô_ contente _djistudá_ inglês.
```

## Test Case 2: Complex Sentences

```
Eu também gosto de música brasileira.
Você é muito alto e bonito.
Ele está no escritório agora.
Nós somos professores de português.
Eles vão de metrô para a escola.
O nome dele é Francisco.
A colega da Sarah trabalha na Acme.
Eu estudo português com um professor brasileiro.
```

## Expected Annotations

The script should add:
- Rule 1: Final -o → [_u_]
- Rule 2: Final -e → [_i_]
- Rule 3: de → de[_dji_], contente → contente[_tchi_]
- Rule 4: Facebook, Internet (not in this test)
- Rule 5: com → com[_coun_], em → em[_eyn_], irmão → irmão[_ãu_], dois → dois[_oys_]
- Rule 6: futebol → futebo~~l~~[_u_], espanhol → espanho~~l~~[_u_]

And preserve:
- _Sô_, _Tô_, _Vô_ (manual reductions)
- _djônibus_, _Gostchi_, _Tenhu_ (manual coalescence)
- All italic transformations
