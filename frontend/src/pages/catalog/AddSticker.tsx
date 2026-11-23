import "./AddSticker.css";
import { useCallback, useMemo, useState, type ReactElement } from "react";
import ReactModal from "react-modal";
import type { Callback, StateRef } from "../../Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useText, { Capitalize, TemplateText } from "../../modules/Text";
import Input from "../../components/control/Input";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";
import { GetEmptySticker, type ILocalSticker } from "../../modules/data/Sticker";
import { useUser } from "../../modules/User";
import { GetSystemUnits, GetUnitSystems, NATIVE_SYSTEM } from "../../modules/Units";
import Select from "../../components/control/Select";
import FilePicker from "../../components/control/FilePicker";
import { useLengthValidator, usePositiveValidator } from "../../modules/Validators";
import TagAdder from "./TagAdder";
import { BYTE_MARGINS } from "../../modules/Format";

export interface IAddListingProps {
    open    : boolean;
    onCancel: Callback;
    onSubmit: StateRef<ILocalSticker>;
}

/**
 * Add sticker modal
 */
export default function AddSticker({open, onCancel, onSubmit}: IAddListingProps): ReactElement {
    const text = useText();
    const user = useUser();
    const colors = useColors();

    const lengthValidator = useLengthValidator();
    const positiveValidator = usePositiveValidator();

    /** The sticker to be added */
    const [sticker, setSticker] = useState<ILocalSticker>(GetEmptySticker());

    /** Is the sticker data valid? */
    const isValid = useMemo(() => sticker.name.length > 0 &&
        sticker.physicalHeight > 0 &&
        sticker.physicalWidth > 0 &&
        sticker.design.name.length > 0
    , [sticker]);

    /** What to do when the sticker is submitted */
    const OnSubmit = useCallback(() => {
        if(!isValid) return;
        onSubmit(sticker);
    }, [onSubmit, sticker]);

    return <ReactModal isOpen={open} onRequestClose={onCancel} style={{content: {borderRadius: "var(--border-radius)", display: "flex", flexDirection: "column", rowGap: 16}}} shouldCloseOnEsc={false}>
        {/* Header */}
        <div className="add-sticker-header">
            <h3>{text.catalog.addSticker.title}</h3>

            <div className="flex-spacer"/>

            <Button onClick={onCancel}>
                <FontAwesomeIcon icon={faXmark} className="add-sticker-close"/>
            </Button>
        </div>

        {/* File */}
        <div className="add-sticker-file-container">
            <label htmlFor="add-sticker-svg">{text.catalog.addSticker.file} *</label>
            <FilePicker
                color={colors.primary}
                input={{
                    id: "add-sticker-svg",
                    accept: ".svg"
                }}
                dropMsg={text.catalog.addSticker.fileDesc}
                required
                onEnter={design => setSticker({...sticker, design})}
                onClear={() => setSticker({...sticker, design: new File([], "")})}
                defaultValue={sticker.design}
                maxFileSize={10 * BYTE_MARGINS.MiB}
            />
        </div>

        {/* Name */}
        <div className="vbox">
            <label htmlFor="add-sticker-name">{text.generic.name} *</label>
            <Input
                id="add-sticker-name"
                className="add-sticker-input"
                color={colors.primary}
                onChange={event => setSticker({...sticker, name: event.target.value})}
                validator={lengthValidator}
                defaultValue={sticker.name}
            />
        </div>

        {/* Description */}
        <div className="vbox">
            <label htmlFor="add-sticker-desc">{text.catalog.addSticker.desc}</label>
            <Input
                id="add-sticker-desc"
                className="add-sticker-input"
                color={colors.primary}
                lines={3}
                onEnter={description => setSticker({...sticker, description})}
                defaultValue={sticker.description}
            />
        </div>

        {/* Tags */}
        <TagAdder
            tags={sticker.tags}
            setTags={tags => setSticker({...sticker, tags})}
        />

        {/* Size */}
        <div className="vbox">
            <div className="add-sticker-sizing-header hbox">
                {TemplateText(
                    text.catalog.addSticker.size,
                    text.measurements.units[GetSystemUnits(user?.unitSystem ?? NATIVE_SYSTEM)].plural
                )}

                <div className="flex-spacer"/>

                <Select defaultValue={user?.unitSystem ?? NATIVE_SYSTEM}>
                    {GetUnitSystems().map(system => <option key={system} value={system}>{Capitalize(system)}</option>)}
                </Select>
            </div>

            <div className="add-sticker-sizing-row hbox">
                <label className="add-sticker-sizing-item vbox" htmlFor="add-sticker-width">
                    {text.catalog.addSticker.width} *
                </label>

                <FontAwesomeIcon icon={faXmark} color="#00000000"/>

                <label className="add-sticker-sizing-item vbox" htmlFor="add-sticker-height">
                    {text.catalog.addSticker.height} *
                </label>
            </div>

            <div className="add-sticker-sizing-row hbox">
                <div className="add-sticker-sizing-item vbox">
                    <Input
                        id="add-sticker-width"
                        className="add-sticker-input"
                        color={colors.primary}
                        type="text"
                        inputMode="numeric"
                        validator={positiveValidator}
                        onChange={event => setSticker({...sticker, physicalWidth: Number.parseFloat(event.target.value)})}
                        defaultValue={sticker.physicalWidth.toString()}
                    />
                </div>

                <FontAwesomeIcon icon={faXmark}/>

                <div className="add-sticker-sizing-item vbox">
                    <Input
                        id="add-sticker-height"
                        className="add-sticker-input"
                        color={colors.primary}
                        type="text"
                        inputMode="numeric"
                        validator={positiveValidator}
                        onChange={event => setSticker({...sticker, physicalHeight: Number.parseFloat(event.target.value)})}
                        defaultValue={sticker.physicalHeight.toString()}
                    />
                </div>
            </div>
        </div>

        <div className="flex-spacer"/>

        {/* Footer */}
        <div className="add-sticker-footer hbox">
            <div className="flex-spacer"/>

            <Button color={colors.secondary} type="reset" id="add-sticker-cancel" onClick={onCancel}>
                {text.generic.cancel}
            </Button>

            <Button color={colors.primary} disabled={!isValid} type="submit" id="add-sticker-create" onClick={OnSubmit}>
                {text.generic.create}
            </Button>
        </div>
    </ReactModal>
}