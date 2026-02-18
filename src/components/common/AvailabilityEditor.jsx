"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultTime = { hour: '9', minute: '00', ampm: 'AM' };
const defaultCloseTime = { hour: '5', minute: '00', ampm: 'PM' };

const AvailabilityEditor = ({ value, onChange }) => {
    const availabilityType = value?.type || '24/7';

    // State for common hours
    const [globalOpen, setGlobalOpen] = useState({ ...defaultTime });
    const [globalClose, setGlobalClose] = useState({ ...defaultCloseTime });

    // State for selected days
    const [selectedDays, setSelectedDays] = useState(DAYS);

    // Initialize state from value
    useEffect(() => {
        if (value?.days && value.days.length > 0) {
            // Find first open day to set initial global times
            const firstOpenDay = value.days.find(d => d.isOpen);
            if (firstOpenDay) {
                setGlobalOpen(parseTime(firstOpenDay.open));
                setGlobalClose(parseTime(firstOpenDay.close));
            }

            // Set selected days based on isOpen
            const openDays = value.days.filter(d => d.isOpen).map(d => d.day);
            // If we have data but no days are open (unlikely if type is custom), maybe default to all? 
            // Better to respect data. If openDays is empty, selectedDays is empty.
            // However, on first load if days is empty but type is custom, we might want defaults.
            // Let's rely on the passed value.
            setSelectedDays(openDays);
        } else {
            // If no data, default to all days selected
            setSelectedDays(DAYS);
        }
    }, []); // Run once on mount. We don't want to reset if parent re-renders unless we want deep sync. 
    // Actually, usually controlled components sync strictly. But here we are destructing complex object to simple state.
    // Let's stick to mount or if value changes significantly (deep comparison is hard). 
    // For now empty dep array or careful condition to avoid loops.
    // Given the previous implementation used `[value]`, let's try to be safe. 
    // If we put `[value]`, updating parent triggers effect, which might reset internal state if we aren't careful.
    // But `value` changes on every edit. Validation loop risk.
    // Better to parse ONLY if `value.type` changes or if `value` is completely new (e.g. from backend fetch).
    // The parent updates `value` on every `onChange`.
    // Let's use a ref or just rely on initial mount for now, as the parent state is driven by this component.

    const parseTime = (timeString) => {
        if (!timeString) return { ...defaultTime };
        const [h, m] = timeString.split(':');
        let hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        return { hour: hour.toString(), minute: m, ampm };
    };

    const formatTimeToString = (timeObj) => {
        let hour = parseInt(timeObj.hour);
        if (timeObj.ampm === 'PM' && hour !== 12) hour += 12;
        if (timeObj.ampm === 'AM' && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${timeObj.minute}`;
    };

    const handleTypeChange = (newType) => {
        updateParent(newType, selectedDays, globalOpen, globalClose);
    };

    const handleDayToggle = (day, isChecked) => {
        const newSelectedDays = isChecked
            ? [...selectedDays, day]
            : selectedDays.filter(d => d !== day);

        setSelectedDays(newSelectedDays);
        updateParent(availabilityType, newSelectedDays, globalOpen, globalClose);
    };

    const handleTimeChange = (type, field, val) => {
        if (type === 'open') {
            const newOpen = { ...globalOpen, [field]: val };
            setGlobalOpen(newOpen);
            updateParent(availabilityType, selectedDays, newOpen, globalClose);
        } else {
            const newClose = { ...globalClose, [field]: val };
            setGlobalClose(newClose);
            updateParent(availabilityType, selectedDays, globalOpen, newClose);
        }
    };

    const updateParent = (type, days, openTime, closeTime) => {
        const daysArray = DAYS.map(day => ({
            day,
            isOpen: days.includes(day),
            open: formatTimeToString(openTime),
            close: formatTimeToString(closeTime)
        }));

        onChange({
            ...value,
            type,
            days: daysArray
        });
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutes = ['00', '15', '30', '45'];

    const TimeSelector = ({ state, onChange }) => (
        <div className="flex gap-1 items-center">
            <Select value={state.hour} onValueChange={(v) => onChange('hour', v)}>
                <SelectTrigger className="w-[70px] h-9">
                    <SelectValue placeholder="Hr" />
                </SelectTrigger>
                <SelectContent>
                    {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
            </Select>
            <span className="text-gray-400">:</span>
            <Select value={state.minute} onValueChange={(v) => onChange('minute', v)}>
                <SelectTrigger className="w-[70px] h-9">
                    <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                    {minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={state.ampm} onValueChange={(v) => onChange('ampm', v)}>
                <SelectTrigger className="w-[70px] h-9">
                    <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <Label className="text-base font-semibold">Business Availability</Label>
                <p className="text-sm text-gray-500 mt-1">Select your operating model.</p>
            </div>

            <RadioGroup value={availabilityType} onValueChange={handleTypeChange} className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="24/7" id="24-7" />
                    <Label htmlFor="24-7" className="font-medium cursor-pointer flex-1">Open 24/7</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-medium cursor-pointer flex-1">Custom Hours</Label>
                </div>
            </RadioGroup>

            {availabilityType === 'custom' && (
                <div className="space-y-6 border rounded-lg p-5 bg-gray-50/50">

                    {/* Common Time Selector */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Working Hours (Applied to all selected days)</Label>
                        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-md border text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">Open:</span>
                                <TimeSelector
                                    state={globalOpen}
                                    onChange={(f, v) => handleTimeChange('open', f, v)}
                                />
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">Close:</span>
                                <TimeSelector
                                    state={globalClose}
                                    onChange={(f, v) => handleTimeChange('close', f, v)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Day Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Working Days</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {DAYS.map(day => (
                                <div key={day} className={`flex items-center space-x-2 border rounded-md p-2 transition-all ${selectedDays.includes(day) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                                    <Checkbox
                                        id={`select-${day}`}
                                        checked={selectedDays.includes(day)}
                                        onCheckedChange={(checked) => handleDayToggle(day, checked)}
                                    />
                                    <Label
                                        htmlFor={`select-${day}`}
                                        className={`cursor-pointer text-sm ${selectedDays.includes(day) ? 'font-medium text-blue-700' : 'text-gray-600'}`}
                                    >
                                        {day.slice(0, 3)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilityEditor;
