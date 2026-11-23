import "./TagAdder.css";
import { useCallback, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import useText, { TemplateText } from "../../modules/Text";
import Tag from "../../components/display/Tag";
import Input, { type IInputRef } from "../../components/control/Input";
import Button from "../../components/control/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useColors } from "../../modules/Colors";
import type { StateRef } from "../../Types";
import useConfig from "../../config";

export interface ITagAdderProps {
    /** The current tags */
    tags       : string[];
    /** How to set tags */
    setTags: StateRef<string[]>;
}

/**
 * A component that allows you to add tags
 */
export default function TagAdder({tags, setTags}: ITagAdderProps): ReactElement {
    const text = useText();
    const colors = useColors();
    const config = useConfig();

    /** Is the user adding tags */
    const [addingTags, setAddingTags] = useState<boolean>(false);

    /** The ref for the tag input */
    const tagInputRef = useRef<IInputRef | null>(null);

    /** What to do when a tag is added */
    const OnAddTag = useCallback((tag: string) => {
        if(!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    }, [tags]);

    /** What to do when a tag is removed */
    const OnRemoveTag = useCallback((tag: string) => {
        if(tags.includes(tag)) {
            setTags(tags.filter(query => query != tag));
        }
    }, [tags]);

    /**
     * Validate the tag input
     */
    const TagValidator = useCallback((query: string) => {
        if(query.length > config.catalog.maxTagLength) return TemplateText(text.catalog.addSticker.badTagLength, config.catalog.maxTagLength.toString());
    }, [config, text, TemplateText]);

    /**
     * What to do when a key is pressed in the input
     */
    const OnEntryKeyPress = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key == "Escape") {
            tagInputRef.current?.root.blur();
        } else if(event.key == "Enter") {
            if(tagInputRef.current != null && !tagInputRef.current.isError) {
                OnAddTag(tagInputRef.current.value);
            }
        }
    }, [tagInputRef, OnAddTag]);

    /**
     * What to do when the user clicks to start adding
     */
    const OnStartAdding = useCallback(() => {
        setAddingTags(true);

        // Needs to trigger after rerender
        setTimeout(() => tagInputRef.current?.root.focus(), 0);
    }, [setAddingTags, tagInputRef]);

    return <div className="vbox tag-adder-container">
        {text.catalog.addSticker.tags}
        <div className="hbox tag-adder-body h-scrollable">
            {tags.length > 0
                ? <div className="tag-adder-control-wrapper hbox">
                    {tags.map(tag => <Tag
                        key={tag}
                        name={tag}
                        onClick={() => OnRemoveTag(tag)}
                        color={colors.primary}
                    />)}
                </div> : <></>
            }

            <Input
                ref={tagInputRef}
                key={tags.length}
                className="tag-adder-input"
                color={colors.primary}
                style={{display: addingTags ? undefined : "none"}}
                onKeyDown={OnEntryKeyPress}
                onBlur={() => setAddingTags(false)}
                validator={TagValidator}
            />

            <div className="tag-adder-control-wrapper">
                <Button color={colors.primary} inverted style={{display: "flex", flexDirection: "row", columnGap: 4, alignItems: "center"}} size="small" onClick={OnStartAdding}>
                    <FontAwesomeIcon icon={faPlus}/>
                    {text.catalog.addSticker.addTag}
                </Button>
            </div>
        </div>
        <div className="desc">{text.catalog.addSticker.tagDesc}</div>
    </div>
}