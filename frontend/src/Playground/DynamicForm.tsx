
import { useState } from "react";

interface FormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'checkbox';
    required: boolean;
    value: string;
}

/*Úkol: Vytvořte komponentu, která dynamicky vykreslí formulář podle pole těchto polí.*/

interface FormProps {
    fields: FormField[]
}
export function Form({ fields }: FormProps) {

    const [formValues, setFormValues] = useState<{ [key: string]: string }>({}) // objekt může mít JAKOUKOLIV vlastnost, jejíž název je string, a její hodnota musí být také string"

    const handleChange = (id: string, value: string) => {

        setFormValues({
            ...formValues,
            [id]: value
        })

    }

    /**
    takže je to takhle, v props přijdou nějaké ID v poli, může to být třeba jméno a email. Moje apka na základě těchto dat vymapuje 2 inputy pro jméno a email.

    ve value těch inputů bude prázdný objekt. Jakmile do inputu začne uživatel něco psát, program předá handleChange, která je na eventu onChange parametr id inputu a to co tam uživatel píše, to se okamžitě nastaví stavu formValue a nastaví se to tam ve formátu objektu, kdy vlastnost je opět id inputu a její hodnota je to co tam uživatel napsal. To se automaticky zbrazuje s renderingem v inputu, protože tam máme formValue opět ale toho konkrétního id */


    return (
        <div>
            <form>
                {fields.map((field) => (
                    <div key={field.id}>

                        <label>
                            <input
                                type={field.type}
                                required={field.required}
                                value={formValues[field.id] || field.value}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                            >
                            </input>
                            {field.label}
                        </label>


                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}